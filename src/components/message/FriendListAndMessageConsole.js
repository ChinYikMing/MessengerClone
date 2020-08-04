import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import MessageConsole from './MessageConsole';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

function FriendList() {
    const [searchVal, setSearchVal] = useState('');
    const [uid, setUid] = useState('');
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentFriendUid, setCurrentFriendUid] = useState('cjAOaSYkKe1JPxsYIeml');
    const [friendsList, setFriendsList] = useState([]);
    const [messagesCollection, setMessagesCollection] = useState({});

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                let datasFromDb = [];
                let friends = [];
                const uid = user.uid;
                setUid(uid);

                const messagesRef = db.collection('users').doc(uid).collection('friends').doc(`${uid}${currentFriendUid}`).collection('messages');
                const friendsRef = db.collection('users').doc(uid).collection('friends').where('displayName', '>', '');

                // pass the messagesRef to messageInput component to send messages
                setMessagesCollection(messagesRef);

                //get the friends list of the users
                friendsRef.onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const id = doc.id;
                        const displayName = doc.data().displayName;
                        friends.push({displayName, id});
                    });

                    setFriendsList(friends);
                })

                //get the specific friends messages data
                messagesRef.orderBy("sendAt").onSnapshot(snapshot => {
                    snapshot.forEach(doc => {
                        const data = doc.data();
                        datasFromDb.push(data);
                    });
                    
                    setMessages(datasFromDb);
                    setUsername(user.displayName);

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
    },[currentFriendUid])

    const deleteFriend = (friendUid, displayName) => {
        const friendsListRef = db.collection('users').doc(uid).collection('friends').doc(`${uid}${friendUid}`);
        const query = friendsListRef.delete();

        query.then(() => {
            console.log(`Deleted ${displayName} successfully`);
        }).catch(err => {
            console.log(`Deleted ${displayName} failed`, err);
        })
    }

    return (
        loading ? (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
        ) : (
                <>
                    <div className="friend-list">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="搜索 Messenger"
                                value={searchVal}
                                onChange={e => setSearchVal(e.target.value)}
                            />
                        </div>
                        {friendsList.map(friend => 
                            <div onClick={e => setCurrentFriendUid(e.target.id)}>
                                <a href={`#${friend.id}`} id={`${friend.id}`}>
                                    {friend.displayName} 
                                    <PersonAddDisabledIcon onClick={() => deleteFriend(friend.id, friend.displayName)}/>
                                </a>
                            </div>
                        )}
                    </div>
                    <MessageConsole messages={messages} username={username} messagesCollection={messagesCollection}/>
                </>
            )
    )
}

export default FriendList
