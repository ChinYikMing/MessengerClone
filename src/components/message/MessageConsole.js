import React, { useState, useEffect } from 'react'
import MessageInput from './MessageInput';
import { auth, db } from '../firebase/config';
import Message from './Message';
import { CircularProgress } from '@material-ui/core';

function MessageConsole({ currentFriendUid }) {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [mutualMessagesRef, setMutualMessagesRef] = useState({});

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user && currentFriendUid) {
                let datasFromDb = [];
                let accept = false;
                let messagesRef;
                const uid = user.uid;
                const displayName = user.displayName
                setUsername(displayName);

                const userFriendsListRef = db.collection('users').doc(uid).collection('friends').where('friendUid', '==', currentFriendUid);
                userFriendsListRef.get().then(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        accept = data.accept;
                    })

                    const mutualMessagesRefUid = accept ? `${currentFriendUid}${uid}` : `${uid}${currentFriendUid}`;
                    messagesRef = db.collection('message').doc(mutualMessagesRefUid).collection('messages');

                    // pass the messagesRef to messageInput component to send messages
                    setMutualMessagesRef(messagesRef);

                    //get the specific friends messages data
                    messagesRef.orderBy("sendAt").onSnapshot(snapshot => {
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
                })
            } else {
                setLoading(true);
                setMessages([]);
                setUsername('');
            }
        })
    }, [currentFriendUid])

    return (
        loading && currentFriendUid ? (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        ) : (
                <div className="message-console-container">
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
                    <MessageInput username={username} currentFriendUid={currentFriendUid} messagesRef={mutualMessagesRef} />
                </div>
            )
    )
}

export default MessageConsole
