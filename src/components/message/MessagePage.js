import React, { useState } from 'react';
import './messages.css'
import { auth } from '../firebase/config';
import { Redirect } from 'react-router-dom';
import FriendProfile from '../friends/FriendProfile';
import Others from '../friends/Others'
import FriendsList from '../friends/FriendsList';
import FriendRequest from '../friends/FriendRequest';
import MessageConsole from './MessageConsole';

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
