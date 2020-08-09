import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddFriendModal from '../modal/AddFriendModal';

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
    const [otherDisplayName, setOtherDisplayName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;
            setUid(uid);

            let others = [];

            //所有user的data
            const othersRef = db.collection('users');
            const unsubscribe = othersRef.onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    const displayName = data.displayName;

                    // firebase updateProfile no effect
                    if (id === uid) {
                        setUsername(displayName);
                    }

                    others.push({ uid: id, displayName });
                })

                setOthersList(others);

                if (loading) {
                    setLoading(false);
                    others = [];
                }
            })

            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;

            let pendingRequests = [];

            //發送方才有的data
            const userPendingFriendRequestsListRef = db.collection('users').doc(uid).collection('pendingFriendRequests');
            const unsubscribe = userPendingFriendRequestsListRef.onSnapshot(snapshot => {
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

            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;

            let requests = [];

            //發送方才有的data
            const requestsListRef = db.collection('users').doc(uid).collection('friendRequests');
            const unsubscribe = requestsListRef.onSnapshot(snapshot => {
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

            return () => unsubscribe();
        }
    }, []);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;

            let friends = [];

            //user的friendsList
            const friendsListRef = db.collection('users').doc(uid).collection('friends');
            const unsubscribe = friendsListRef.onSnapshot(snapshot => {
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

            return () => unsubscribe();
        }
    }, []);

    const addFriend = (uid, username, friendUid, friendDisplayName) => {
        // set other displayName and pass to modal
        setOtherDisplayName(friendDisplayName);
        
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
                    uid
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
                        uid: friendUid
                    })
                } else {
                    throw new Error(`he/she is already in your pending friend requests list`);
                }
            })
        }).then(() => {
            //show a add modal
            setIsOpen(true);
        }).then(() => {
            console.log(`Sending request successfully`);
        }).catch(err => {
            console.log(`Sending request failed`, err);
        })
    }

    return (
        loading ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="users-container">
                    <AddFriendModal open={isOpen} setIsOpen={setIsOpen} otherDisplayName={otherDisplayName}/>
                    <h3>Other Users</h3>
                    {othersList.map(other =>
                        other.uid !== uid &&
                            !pendingRequestsList.includes(other.uid) &&
                            !requestsList.includes(other.uid) &&
                            !friendsList.includes(other.uid) ? (
                                <div className="user" key={other.uid}>
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
