import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    addFriendButtonStyle: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

function User() {
    const classes = useStyles();
    const [usersList, setUsersList] = useState([]);
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);
    const [friendsListUid, setFriendsListUid] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            let users = [];
            let friendsUid = [];

            if (user) {
                const uid = user.uid;
                setUid(uid);

                const usersRef = db.collection('users');
                usersRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const uid = doc.id;
                        const displayName = data.displayName;
                        users.push({ uid, displayName });
                    })

                    setUsersList(users);
                })

                const userFriendsListRef = db.collection('users').doc(uid).collection('friends');
                userFriendsListRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const uid = doc.id;
                        friendsUid.push(uid);
                    })

                    setFriendsListUid(friendsUid);
                })

                if (loading)
                    setLoading(false);

            } else
                setLoading(true);

            users = []
            friendsUid = [];
        })
    }, [])

    const acceptFriend = (friendUid, displayName) => {
        const friendsListRef = db.collection('users').doc(uid).collection('friends').doc(`${friendUid}${uid}`);
        const query = friendsListRef.get();

        query.then(snapshot => {
            return snapshot.data();
        }).then(res => {
            if (res === undefined) {
                friendsListRef.set({
                    displayName
                })
            } else {
                throw new Error(`${displayName} is your friend already`);
            }
        }).then(() => {
            console.log(`Accept ${displayName} successfully`);
        }).catch(err => {
            console.log(`Accept ${displayName} failed`, err);
        })
    }

    const addFriend = (friendUid, displayName) => {
        const friendsListRef = db.collection('users').doc(uid).collection('friends').doc(`${uid}${friendUid}`);
        const query = friendsListRef.get();

        query.then(snapshot => {
            return snapshot.data();
        }).then(res => {
            if (res === undefined) {
                friendsListRef.set({
                    displayName
                })
            } else {
                throw new Error(`${displayName} is your friend already`);
            }
        }).then(() => {
            console.log(`Added ${displayName} successfully`);
        }).catch(err => {
            console.log(`Added ${displayName} failed`, err);
        })
    }

    return (
        loading ? (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
        ) : (
                <>
                    <h1>Users List</h1>
                    <div className="users-container">
                        {usersList.map(user =>
                            <div className="user">
                                {user.displayName}
                                {friendsListUid.map(fUid => {
                                    return `${uid}${user.uid}` === fUid ?
                                        (
                                            <AddIcon onClick={() => acceptFriend(user.uid, user.displayName)} className={classes.addFriendButtonStyle} />
                                        ) : (
                                            <PersonAddIcon onClick={() => addFriend(user.uid, user.displayName)} className={classes.addFriendButtonStyle} />
                                        )
                                })}
                            </div>
                        )}
                    </div>
                </>
            )
    )
}

export default User
