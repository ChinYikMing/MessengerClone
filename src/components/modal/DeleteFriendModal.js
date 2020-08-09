import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import { db } from '../firebase/config';

const useStyles = makeStyles({
    deleteButtonStyle: {
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

function DeleteFriendModal({ open, setIsOpen, uid, otherUid, otherDisplayName, mutualMessagesRefUid, username, avatar, selectFriendHandler }) {
    const classes = useStyles();

    const deleteMessage = (messageRef) => {
        return new Promise((resolve, reject) => {
            messageRef.delete();
        });
    }

    const deleteFriend = (friendUid, displayName, mutualMessagesRefUid) => {
        setIsOpen(false);
        
        //user自己的friendsList
        const userfriendsListRef = db.collection('users').doc(uid).collection('friends').doc(friendUid);

        //要刪除那一方的friendsList
        const friendsListRef = db.collection('users').doc(friendUid).collection('friends').doc(uid);

        //刪除user和friend的共同聊天記錄的subcollection "messages"
        const mutualMessagesRef = db.collection('mutualMessages').doc(mutualMessagesRefUid).collection('messages');
        mutualMessagesRef.get().then(snapshot => {
            let messagesId = [];
            snapshot.forEach(doc => {
                const id = doc.id;
                messagesId.push(id);
            })
            return messagesId;
        }).then(messagesId => {
            let messagesRef = [];
            messagesId.forEach(messageId => {
                let messageRef = db.collection('mutualMessages').doc(mutualMessagesRefUid).collection('messages').doc(messageId);
                messagesRef.push(messageRef);
            })
            return messagesRef;
        }).then(messagesRef => {
            let promises = [];
            messagesRef.forEach(messageRef => {
                let promise = deleteMessage(messageRef);
                promises.push(promise);
            })
            return promises;
        }).then(promises => {
            Promise.all(promises);
        }).then(() => {
            //刪除user和friend的共同聊天記錄
            db.collection('mutualMessages').doc(mutualMessagesRefUid).delete();
        }).then(() => {
            userfriendsListRef.delete()
        }).then(() => {
            friendsListRef.delete();
        }).then(() => {
            //clear the messages console
            selectFriendHandler(uid, username, avatar);
        }).then(() => {
            console.log(`Deleted ${displayName} successfully`);
        }).catch(err => {
            console.log(`Deleted ${displayName} failed`, err);
        })
    }

    if (!open) return null;

    return (
        <>
            <div style={OVERLAY_STYLE}></div>
            <div style={MODAL_STYLE}>
                <div style={{textAlign: 'center', color: 'red'}}>
                    ARE YOU SURE TO DELETE <span style={{ fontWeight: 'bold', color: '#000' }}>{otherDisplayName}</span>?
                    <br />
                    (ALL CONVERSATION HISTORY WILL BE DELETED)
                </div>
                <div style={BUTTON_CONTAINER_STYLE}>
                    <Button
                        size="small"
                        className={classes.deleteButtonStyle}
                        onClick={() => deleteFriend(otherUid, otherDisplayName, mutualMessagesRefUid)}
                    >
                        DELETE
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

export default DeleteFriendModal
