import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import { db } from '../firebase/config';

const useStyles = makeStyles({
    RejectButtonStyle: {
        backgroundColor: red[600],
        padding: '5px',
        '&:hover': {
            backgroundColor: red[500]
        }
    },
    cancelButtonStyle: {
        backgroundColor: 'white',
        border: '2px red solid',
        color: red[600]
    }
})

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    width: '300px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    zIndex: 1000,
};

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

const BUTTON_CONTAINER_STYLE = {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
}

function RejectFriendModal({ open, setIsOpen, uid, otherUid, otherDisplayName }) {
    const classes = useStyles();

    const rejectFriend = (uid, friendUid, friendDisplayName) => {
        setIsOpen(false);

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

    if (!open) return null;

    return (
        <>
            <div style={OVERLAY_STYLE}></div>
            <div style={MODAL_STYLE}>
                <div style={{textAlign: 'center', color: 'red'}}>
                    ARE YOU SURE TO REJECT <span style={{ fontWeight: 'bold', color: '#000' }}>{otherDisplayName}</span>?
                </div>
                <div style={BUTTON_CONTAINER_STYLE}>
                    <Button
                        size="small"
                        className={classes.RejectButtonStyle}
                        onClick={() => rejectFriend(uid, otherUid, otherDisplayName)}
                    >
                        REJECT
                    </Button>
                    <Button
                        size="small"
                        className={classes.cancelButtonStyle}
                        onClick={() => setIsOpen(false)}
                    >
                        CANCEL
                    </Button>
                </div>
            </div>
        </>
    )
}

export default RejectFriendModal
