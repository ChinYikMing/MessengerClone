import React, { useState, useEffect } from 'react'
import MessageInput from './MessageInput';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { auth, db } from '../firebase/config';
import Message from './Message';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    linkStyle: {
        textDecoration: 'none'
    }
}));

const signOut = () => {
    auth.signOut();
}

function MessageConsole({ currentFriendUid }) {
    const classes = useStyles();
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [messagesRef, setMessagesRef] = useState({});

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                let datasFromDb = [];
                let accept = false;
                let messagesRef;
                const uid = user.uid;
                const displayName = user.displayName
                setUsername(displayName);

                const userFriendsListRef = db.collection('users').doc(uid).collection('friends').where("friendUid", "==", `${currentFriendUid}`);
                userFriendsListRef.get().then(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        accept = data.accept
                    })

                    const messagesRefUid = accept ? `${currentFriendUid}${uid}` : `${uid}${currentFriendUid}`;
                    messagesRef = db.collection('message').doc(messagesRefUid).collection('messages');

                    // pass the messagesRef to messageInput component to send messages
                    setMessagesRef(messagesRef);

                    //get the specific friends messages data
                    messagesRef.orderBy("sendAt").onSnapshot(snapshot => {
                        snapshot.forEach(doc => {
                            const data = doc.data();
                            datasFromDb.push(data);
                        });
                        setMessages(datasFromDb);
                    })

                    if (loading) {
                        setLoading(false);
                        datasFromDb = [];
                    }
                })
            } else {
                setLoading(true);
                setMessages([]);
                setUsername('');
            }
        })
    }, [currentFriendUid])

    return (
        loading ? (
            <div style={{ height: '100vh' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="message-console-container">
                    <div>
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

                    <div className="messages-container">
                        {
                            messages.map(message =>
                                <Message
                                    key={message.text}
                                    username={message.username}
                                    text={message.text}
                                    sendAt={message.sendAt}
                                    signInUsername={username}
                                />
                            )
                        }
                    </div>
                    <MessageInput username={username} currentFriendUid={currentFriendUid} messagesRef={messagesRef} />
                </div>
            )
    )
}

export default MessageConsole
