import React, { useState, useEffect } from 'react';
import Messenge from './Messenge';
import './messages.css'
import { auth, db } from './firebase/config';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    textFieldStyle: {
        width: '100%'
    },
    buttonStyle: {
        marginTop: '10px',
        marginLeft: '5px'
    },
    linkStyle: {
        textDecoration: 'none'
    }
}));

function MessagePage() {
    const classes = useStyles();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                let datasFromDb = [];
    
                return db.collection('messages').orderBy("sendAt").onSnapshot(snapshot => {
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
                });
            } else {
                setLoading(true);
                setUsername('');
                setMessages([]);
            }
        })
    }, []);

    const sendMessageHandler = (username, text) => {
        db.collection('messages').add({
            username,
            text,
            sendAt: new Date()
        }).then(() => {
            setText('');
        })
    }
    
    const signOut = () => {
        auth.signOut();
    }

    if(!auth.W)
        return <Redirect to='/' />

    return (
        loading ? (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
        ) : (
        <>
            <Link to='/' className={classes.linkStyle}>
                <Button
                    variant="contained" color="primary"
                    className={classes.buttonStyle}
                    onClick={() => signOut()}
                >
                    Sign Out
            </Button>
            </Link>

            <div className="messages-container">
                {
                    messages.map(message =>
                        <Messenge
                            key={message.text}
                            username={message.username}
                            text={message.text}
                            signInUsername={username}
                        />
                    )
                }
            </div>

            <div className="input-container">
                <TextField
                    label="Your message:"
                    value={text}
                    className={classes.textFieldStyle}
                    onChange={e => setText(e.target.value)}
                />
                <Button
                    variant="contained" color="primary"
                    className={classes.buttonStyle}
                    onClick={() => sendMessageHandler(`${username}`, text)}>
                    Send
                </Button>
            </div>
        </>
        )
    )
}

export default MessagePage
