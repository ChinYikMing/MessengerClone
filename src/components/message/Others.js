import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
    addFriendButtonStyle: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

function User() {
    const classes = useStyles();
    const [othersList, setOthersList] = useState([]);
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [pendingRequestsList, setPendingRequestsList] = useState([]);
    const [requestsList, setRequestsList] = useState([]);
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            let others = [];
            let pendingRequests = [];
            let requests = [];
            let friends = [];

            if (user) {
                const uid = user.uid;
                const displayName = user.displayName
                setUsername(displayName);
                setUid(uid);

                //所有user的data
                const othersRef = db.collection('users');
                othersRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        const uid = doc.id;
                        const displayName = data.displayName;
                        others.push({ uid, displayName });
                    })

                    setOthersList(others);

                    if (loading) {
                        setLoading(false);
                        others = [];
                    }
                })

                //發送方才有的data
                const userPendingFriendRequestsListRef = db.collection('users').doc(uid).collection('pendingFriendRequests');
                userPendingFriendRequestsListRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const uid = doc.id;
                        pendingRequests.push(uid);
                    })

                    setPendingRequestsList(pendingRequests);

                    if (loading) {
                        setLoading(false);
                        pendingRequests = [];
                    }
                })

                //接收方才有的data
                const requestsListRef = db.collection('users').doc(uid).collection('friendRequests');
                requestsListRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const uid = doc.id;
                        requests.push(uid);
                    })

                    setRequestsList(requests);

                    if (loading) {
                        setLoading(false);
                        requests = [];
                    }
                })

                //user的friendsList
                const friendsListRef = db.collection('users').doc(uid).collection('friends');
                friendsListRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const uid = doc.id;
                        friends.push(uid);
                    })

                    setFriendsList(friends);

                    if (loading) {
                        setLoading(false);
                        friends = [];
                    }
                })
            } else {
                setLoading(true);
            }
        })
    }, [])

    const addFriend = (uid, username, friendUid, friendDisplayName) => {
        const friendRequestsListRef = db.collection('users').doc(friendUid).collection('friendRequests').doc(uid);
        const query = friendRequestsListRef.get();

        const userPendingFriendRequestsListRef = db.collection('users').doc(uid).collection('pendingFriendRequests').doc(friendUid);
        const userQuery = userPendingFriendRequestsListRef.get();

        query.then(snapshot => {
            return snapshot.data();
        }).then(res => {
            if (res === undefined) {
                friendRequestsListRef.set({
                    displayName: username,
                    uid,
                    accept: true
                })
            } else {
                throw new Error(`he/she is your friend already`);
            }
        }).then(() => {
            userQuery.then(snapshot => {
                return snapshot.data();
            }).then(res => {
                if (res === undefined) {
                    userPendingFriendRequestsListRef.set({
                        displayName: friendDisplayName,
                        uid: friendUid,
                        accept: false
                    })
                } else {
                    throw new Error(`he/she is already in your pending friend requests list`);
                }
            })
        }).then(() => {
            console.log(`Sending request successfully`);
        }).catch(err => {
            console.log(`Sending request failed`, err);
        })
    }

    return (
        loading ? (
            <div style={{ height: '100%' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="users-container">
                    Other Users
                    {othersList.map(other =>
                        other.displayName !== username &&
                            !pendingRequestsList.includes(other.uid) &&
                            !requestsList.includes(other.uid) &&
                            !friendsList.includes(other.uid) ? (
                                <div className="user">
                                    {other.displayName}
                                    <PersonAddIcon onClick={() => addFriend(uid, username, other.uid, other.displayName)} className={classes.addFriendButtonStyle} />
                                </div>
                            ) : null
                    )}
                </div>
            )
    )
}

export default User
