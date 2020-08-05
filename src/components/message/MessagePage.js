import React, { useState, useEffect } from 'react';
import './messages.css'
import { auth } from '../firebase/config';
import { Redirect } from 'react-router-dom';
import FriendProfile from './FriendProfile';
import Others from './Others'
import FriendsList from './FriendsList';
import MessageConsole from './MessageConsole';
import FriendRequest from './FriendRequest';

function MessagePage() {
    const [currentFriendUid, setCurrentFriendUid] = useState('');
    const [uid, setUid] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
            } else {
                setUid('');
            }
        })
    })

    if (!auth.W)
        return <Redirect to='/signin' />

    return (
        <div className="message-page-container">
            <FriendsList setCurrentFriendUid={setCurrentFriendUid} />
            <MessageConsole currentFriendUid={currentFriendUid} />
            <div className="friendProfile-and-users-container">
                <FriendProfile />
                <div className="user-and-friendRequest-container">
                    <Others />
                    <FriendRequest />
                </div>
            </div>
        </div>
    )
}

export default MessagePage
