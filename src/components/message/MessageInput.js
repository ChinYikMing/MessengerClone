import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    textFieldStyle: {
        width: '100%'
    },
    buttonStyle: {
        marginTop: '10px',
        marginLeft: '5px'
    },
}));

function MessageInput({ username, currentFriendUid, messagesRef }) {
    const classes = useStyles();
    const [text, setText] = useState('');
    
    const sendMessageHandler = (username, text) => {
        messagesRef.add({
            username,
            text,
            sendAt: moment().format("MMMM Do YYYY, h:mm:ss a")
        }).then(() => {
            setText('');
        })
    }
   
    return (
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
                disabled={!text || !currentFriendUid}
                onClick={() => sendMessageHandler(`${username}`, text)}>
                Send
            </Button>
        </div>
    )
}

export default MessageInput
