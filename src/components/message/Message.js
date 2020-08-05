import React, { useState } from 'react'
import { Typography, makeStyles } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import moment from 'moment';

const useStyles = makeStyles({
    myTypoStyles: {
        backgroundColor: blue[600],
        color: 'white',
        borderRadius: '8%',
        fontSize: '1.3rem',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    othersTypoStyles: {
        backgroundColor: grey[300],
        color: 'black',
        borderRadius: '8%',
        fontSize: '1.3rem',
        '&:hover': {
            cursor: 'pointer'
        }
    },
})

function Message({ username, text, sendAt, signInUsername }) {
    const classes = useStyles();
    const [clicked, setClicked] = useState(false);

    return (
        username == signInUsername ? (
            <div className="my-messages" onClick={() => setClicked(!clicked)}>
                <Typography className={classes.myTypoStyles}>
                    {text}
                </Typography >
                {
                    clicked ? (
                        <Typography variant="subtitle2" >
                            {sendAt}
                        </Typography>
                    ) : null
                }
            </div>
        ) : (
                <div className="others-messages" onClick={() => setClicked(!clicked)}>
                    <Typography className={classes.othersTypoStyles}>
                        {text}
                    </Typography>
                    {
                    clicked ? (
                        <Typography variant="subtitle2">
                            {sendAt}
                        </Typography>
                    ) : null
                }
                </div>
            )
    )
}

export default Message
