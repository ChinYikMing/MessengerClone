import React, { useState } from 'react';
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
    const [currentFriendDisplayName, setCurrentFriendDisplayName] = useState('');
    const [currentFriendAvatar, setCurrentFriendAvatar] = useState('');

    //auth.W is uid
    if (!auth.W)
        return <Redirect to='/signin' />

    return (
        <div className="message-page-container">
            <FriendsList
                setCurrentFriendUid={setCurrentFriendUid}
                setCurrentFriendDisplayName={setCurrentFriendDisplayName}
                setCurrentFriendAvatar={setCurrentFriendAvatar}
            />
            <MessageConsole
                currentFriendUid={currentFriendUid}
                currentFriendDisplayName={currentFriendDisplayName}
            />
            <div className="friendProfile-and-users-container">
                <FriendProfile
                    currentFriendDisplayName={currentFriendDisplayName}
                    currentFriendAvatar={currentFriendAvatar}
                    setCurrentFriendAvatar={setCurrentFriendAvatar}
                />
                <div className="user-and-friendRequest-container">
                    <Others />
                    <FriendRequest />
                </div>
            </div>
        </div>
    )
}

export default MessagePage
