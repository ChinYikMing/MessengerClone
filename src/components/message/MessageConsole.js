import React, { useState, useEffect } from 'react'
import MessageInput from './MessageInput';
import { auth, db } from '../firebase/config';
import Message from './Message';
import { CircularProgress } from '@material-ui/core';

function MessageConsole({ currentFriendUid, currentFriendDisplayName }) {
    const [messages, setMessages] = useState([]);
    const [uid, setUid]= useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [mutualMessagesRef, setMutualMessagesRef] = useState({});

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid, displayName } = user;
            let messagesRef = '';
            setUid(uid);
            setUsername(displayName);

            if (currentFriendUid) {
                const userFriendsListRef = db.collection('users').doc(uid).collection('friends').where('friendUid', '==', currentFriendUid);
                userFriendsListRef.get().then(snapshot => {
                    snapshot.forEach(doc => {
                        const { mutualMessagesRefUid } = doc.data();
                        messagesRef = db.collection('mutualMessages').doc(mutualMessagesRefUid).collection('messages');
                    })

                    setLoading(true);
                    setMutualMessagesRef(messagesRef);
                })
            }
        }
    }, [currentFriendUid])

    useEffect(() => {
        let datasFromDb = [];

        if (Object.keys(mutualMessagesRef).length !== 0) {
            const unsubscribe = mutualMessagesRef.orderBy("sendAt").onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    datasFromDb.push(data);
                });
                setMessages(datasFromDb);

                if (loading) {
                    setLoading(false);
                    datasFromDb = [];
                }
            })

            return () => unsubscribe();
        }
    }, [mutualMessagesRef])
    
    return (
        loading && currentFriendUid ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="message-console-container">
                    <div className="messages-container">
                        {
                            messages.length === 0 ? (
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{ lineHeight: '20vh' }}>
                                        Start chatting with
                                        {currentFriendDisplayName ? ' ' + currentFriendDisplayName : " your friends"}
                                    </h4>
                                </div>
                            ) : (
                                    messages.map(message =>
                                        <Message
                                            key={message.text}
                                            username={message.username}
                                            text={message.text}
                                            sendAt={message.sendAt}
                                            signInUsername={username}
                                        />
                                    )
                                )
                        }
                    </div>
                    <MessageInput username={username} currentFriendUid={currentFriendUid} mutualMessagesRef={mutualMessagesRef} />
                </div>
            )
    )
}

export default MessageConsole
