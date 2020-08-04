import React from 'react'
import MessageInput from './MessageInput';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { auth, db } from '../firebase/config';
import Message from './Message';

const useStyles = makeStyles((theme) => ({
    linkStyle: {
        textDecoration: 'none'
    }
}));

const signOut = () => {
    auth.signOut();
}

function MessageConsole({ messages, username, messagesCollection }) {
    const classes = useStyles();
    

    return (
        <div className="message-console">
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
                        <Message
                            key={message.text}
                            username={message.username}
                            text={message.text}
                            signInUsername={username}
                        />
                    )
                }
            </div>
            <MessageInput username={username} messagesCollection={messagesCollection}/>
        </div>
    )
}

export default MessageConsole
