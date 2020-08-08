import React, { useState, useEffect } from 'react'
import LinearProgress from '@material-ui/core/LinearProgress';
import { auth, db, storage } from '../firebase/config';

function FriendProfile({ currentFriendDisplayName, currentFriendAvatar, setCurrentFriendAvatar }) {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [uid, setUid] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const uid = user.uid;
            const displayName = user.displayName;
            setUsername(displayName);
            setUid(uid);
        }
    }, [])

    const updateAvatar = (friendRef, newUrl) => {
        return new Promise((resolve, reject) => {
            friendRef.set({
                avatar: newUrl
            }, { merge: true })
        });
    }

    const uploadHandler = (e) => {
        e.preventDefault();

        const storageRef = storage.ref(`avatars/${uid}/${avatar.name}`);

        const task = storageRef.put(avatar);

        task.on("state_changed",
            function progress(snapshot) {
                const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(percentage);
            },
            function error(err) {
                console.log('err', err);
            },
            function complete() {
                task.snapshot.ref.getDownloadURL().then(downloadURL => {
                    //把這個downloadURL update到user的detail和friendList的avatar

                    //user detail ref
                    const userDetailRef = db.collection('users').doc(uid);

                    //user 自己的ref， 因為自己能和自己對話
                    const userSelfRef = db.collection('users').doc(uid).collection('friends').doc(uid);

                    //所以是user的朋友都需要update user的img，所以要先取得他們的uid
                    const friendsListRef = db.collection('users').doc(uid).collection('friends');

                    friendsListRef.get().then(snapshot => {
                        let friendsUid = [];
                        snapshot.forEach(doc => {
                            const data = doc.data();
                            const { friendUid } = data;

                            if (friendUid !== uid) {
                                friendsUid.push(friendUid);
                            }
                        })
                        return friendsUid;
                    }).then(friendsUid => {
                        let friendsRef = [];
                        friendsUid.forEach(friendUid => {
                            let ref = db.collection('users').doc(friendUid).collection('friends').doc(uid);
                            friendsRef.push(ref);
                        });
                        return friendsRef;
                    }).then(friendsRef => {
                        let promises = [];
                        friendsRef.forEach(friendRef => {
                            let promise = updateAvatar(friendRef, downloadURL);
                            promises.push(promise);
                        });
                        return promises;
                    }).then(promises => {
                        Promise.all(promises);
                    }).then(() => {
                        userDetailRef.set({
                            avatar: downloadURL
                        }, { merge: true })
                    }).then(() => {
                        userSelfRef.set({
                            avatar: downloadURL
                        }, { merge: true })
                    }).then(() => {
                        setCurrentFriendAvatar(downloadURL);
                    })
                })
            }
        )
    }

    return (

        <div className="friend-profile-container">
            <img className="profile-image" src={currentFriendAvatar} />
            <div className="profile-name">{currentFriendDisplayName}</div>
            {currentFriendDisplayName === username ? (
                <div className="avatar-upload-form-container">
                    <div className="linear-progress-container">
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                        />
                    </div>
                    <form onSubmit={uploadHandler}>
                        <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            onChange={e => setAvatar(e.target.files[0])}
                        />
                        <button type="submit">Upload</button>
                    </form>
                </div>
            ) : null
            }
        </div>
    )
}

export default FriendProfile
