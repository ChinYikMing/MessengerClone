import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
    buttonStyle: {
        '&:hover': {
            cursor: 'pointer'
        }
    }
}));

function FriendRequest() {
    const classes = useStyles();
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [friendRequestsList, setfriendRequestsList] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid, displayName } = user;
            setUid(uid);
            setUsername(displayName);

            let friendRequests = [];
            const friendRequestsListRef = db.collection('users').doc(uid).collection('friendRequests');

            const unsubscribe = friendRequestsListRef.onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const { uid, displayName, accept } = doc.data();
                    friendRequests.push({ uid, displayName, accept });
                })

                setfriendRequestsList(friendRequests);

                if (loading) {
                    setLoading(false);
                    friendRequests = [];
                }
            })
            return () => unsubscribe();
        }
    }, [])

    const rejectFriend = (uid, username, friendUid, friendDisplayName) => {
        //user自己的friendsRequestsList
        const userfriendRequestsListRef = db.collection('users').doc(uid).collection('friendRequests').doc(friendUid);

        //發送請求那一方的pendingFriendsRequests
        const reqPendingFriendRequestsListRef = db.collection('users').doc(friendUid).collection('pendingFriendRequests').doc(uid);

        userfriendRequestsListRef.delete()
            .then(() => {
                reqPendingFriendRequestsListRef.delete()
            }).then(() => {
                console.log(`You have rejected ${friendDisplayName}'s friend request`);
            })
    }

    const acceptFriend = (uid, username, friendUid, friendDisplayName) => {
        //user自己的friendList
        const userFriendsListRef = db.collection('users').doc(uid).collection('friends').doc(friendUid);

        //user自己的friendsRequestsList
        const userfriendRequestsListRef = db.collection('users').doc(uid).collection('friendRequests').doc(friendUid);

        //發送請求那一方的friendList
        const reqFriendsListRef = db.collection('users').doc(friendUid).collection('friends').doc(uid);

        //發送請求那一方的pendingFriendsRequests
        const reqPendingFriendRequestsListRef = db.collection('users').doc(friendUid).collection('pendingFriendRequests').doc(uid);

        //2個人的共同聊天記錄db
        const mutualMessagesRef = db.collection('message').doc(`${uid}${friendUid}`);

        reqFriendsListRef.set({
            displayName: username,
            friendUid: uid,
            mutualMessagesRefUid: uid + friendUid
        }).then(() => {
            reqPendingFriendRequestsListRef.delete();
        }).then(() => {
            userFriendsListRef.set({
                displayName: friendDisplayName,
                friendUid,
                mutualMessagesRefUid: uid + friendUid
            });
        }).then(() => {
            mutualMessagesRef.set({});
        }).then(() => {
            userfriendRequestsListRef.delete();
        }).then(() => {
            console.log(`Accept ${friendDisplayName} successfully`);
        }).catch(err => {
            console.log(`Accept ${friendDisplayName} failed`, err);
        })
    }

    return (
        loading ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="users-container">
                    <h3>Friend Requests</h3>
                    {friendRequestsList.map(fr =>
                        <div className="user">
                            {fr.displayName}
                            <AddIcon onClick={() => acceptFriend(uid, username, fr.uid, fr.displayName)} className={classes.buttonStyle} />
                            <ClearIcon onClick={() => rejectFriend(uid, username, fr.uid, fr.displayName)} className={classes.buttonStyle} />
                        </div>
                    )}
                </div>
            )
    )
}

export default FriendRequest