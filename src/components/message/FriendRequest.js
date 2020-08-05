import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
    acceptFriendButtonStyle: {
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
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            let friendRequests = [];

            if (user) {
                const uid = user.uid;
                const displayName = user.displayName
                setUsername(displayName);
                setUid(uid);

                const friendRequestsListRef = db.collection('users').doc(uid).collection('friendRequests');
                friendRequestsListRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const { uid, displayName, accept } = doc.data();
                        friendRequests.push({ uid, displayName, accept });
                    })

                    setfriendRequestsList(friendRequests);
                })

                if (loading)
                    setLoading(false);
            } else
                setLoading(true);

            friendRequests = [];
        })
    }, [clicked])

    const acceptFriendHandler = (uid, username, friendUid, friendDisplayName) => {
        acceptFriend(uid, username, friendUid, friendDisplayName);
        setClicked(!clicked);
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


        reqFriendsListRef.set({
            displayName: username,
            uid,
            accept: false
        }).then(() => {
            reqPendingFriendRequestsListRef.delete();
        }).then(() => {
            userFriendsListRef.set({
                displayName: friendDisplayName,
                friendUid,
                accept: true
            })
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
            <div style={{ height: '100%' }}>
                <CircularProgress />
            </div>
        ) : (
                <div>
                    Friend Requests
                    <div className="users-container">
                        {friendRequestsList.map(fr =>
                            <div className="user">
                                {fr.displayName}
                                <AddIcon onClick={() => acceptFriendHandler(uid, username, fr.uid, fr.displayName)} className={classes.acceptFriendButtonStyle} />
                            </div>
                        )}
                    </div>
                </div>
            )
    )
}

export default FriendRequest