import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    deleteButtonStyle: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
});

const signOut = () => {
    auth.signOut().then(() => {
        console.log('Sign Out successfully')
    });
}

function FriendList({ setCurrentFriendUid, setCurrentFriendDisplayName, setCurrentFriendAvatar }) {
    const classes = useStyles();
    const [searchVal, setSearchVal] = useState('');
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;
            setUid(uid);

            let friends = [];
            const friendsRef = db.collection('users').doc(uid).collection('friends');

            const unsubscribe = friendsRef.onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const id = doc.id;
                    const { displayName, avatar } = doc.data();

                    if (id === uid) {
                        setUsername(displayName);
                        setAvatar(avatar);
                    }

                    friends.push({ displayName, id, avatar });
                });

                setFriendsList(friends);

                if (loading) {
                    setLoading(false);
                    friends = [];
                }
            })

            return () => unsubscribe();
        }
    }, [])

    const deleteFriend = (friendUid, displayName) => {
        //reset currentFriendUid
        setCurrentFriendUid('');

        //user自己的friendsList
        const userfriendsListRef = db.collection('users').doc(uid).collection('friends').doc(friendUid);

        //要刪除那一方的friendsList
        const friendsListRef = db.collection('users').doc(friendUid).collection('friends').doc(uid);

        //刪除他們共同的聊天記錄, firebase不支持刪除subcollection, 所以暫時先同步(friendUid + Uid 和 Uid + friendUid)
        // let messageUid = uid + friendUid;
        // let messageRef = db.collection('message').doc(messageUid).collection('messages');

        userfriendsListRef.delete().then(() => {
            friendsListRef.delete();
        }).then(() => {
            console.log(`Deleted ${displayName} successfully`);
        }).catch(err => {
            console.log(`Deleted ${displayName} failed`, err);
        })
    }

    const selectFriendHandler = (friendUid, friendDisplayName, friendAvatar) => {
        setCurrentFriendUid(friendUid);
        setCurrentFriendDisplayName(friendDisplayName);
        setCurrentFriendAvatar(friendAvatar);
    }

    return (
        loading ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="friends-list-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="搜索 Messenger"
                            value={searchVal}
                            onChange={e => setSearchVal(e.target.value)}
                        />
                    </div>
                    <div><h2>Your friends List</h2></div>
                    < div className="friends-list-entry" key={uid}>
                        <div onClick={() => selectFriendHandler(uid, username, avatar)}>
                            <a href={`#${uid}`} id={uid} style={{ textDecoration: 'none', color: 'black' }}>
                                My Profile
                            </a>
                        </div>
                    </div>
                    {friendsList.map(friend =>
                        friend.displayName.toLowerCase().indexOf(searchVal) !== -1 &&
                        friend.displayName !== username &&
                        < div className="friends-list-entry" key={friend.id}>
                            <div onClick={() => selectFriendHandler(friend.id, friend.displayName, friend.avatar)}>
                                <a href={`#${friend.id}`} id={`${friend.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {friend.displayName}
                                </a>
                            </div>
                            <div><PersonAddDisabledIcon
                                onClick={() => deleteFriend(friend.id, friend.displayName)}
                                className={classes.deleteButtonStyle} />
                            </div>
                        </div>
                    )}
                    <div className="signout-button">
                        <Link to='/' className={classes.linkStyle}>
                            <Button
                                variant="contained" color="primary"
                                className={classes.buttonStyle}
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>
                        </Link>
                    </div>
                </div>
            )
    )
}

export default FriendList

