import React, { useState, useEffect } from 'react';
import './messages.css'
import { auth, db } from '../firebase/config';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FriendListAndMessageConsole from './FriendListAndMessageConsole'
import FriendProfile from './FriendProfile';

const useStyles = makeStyles((theme) => ({
    linkStyle: {
        textDecoration: 'none'
    }
}));

function MessagePage() {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {


            } else {

            }
        })
    }, []);

    if (!auth.W)
        return <Redirect to='/' />

    return (
        <div className="message-page-container">
            <FriendListAndMessageConsole />
            <FriendProfile />
        </div>
    )
}

export default MessagePage
