import React from 'react';
import './messages.css'
import { auth } from '../firebase/config';
import { Redirect } from 'react-router-dom';
import FriendListAndMessageConsole from './FriendListAndMessageConsole'
import FriendProfile from './FriendProfile';
import User from './User'

function MessagePage() {
    if (!auth.W)
        return <Redirect to='/' />

    return (
        <div className="message-page-container">
            <FriendListAndMessageConsole />
            <div className="friendProfile-and-users-container">
                <FriendProfile />
                <User />
            </div>
        </div>
    )
}

export default MessagePage
