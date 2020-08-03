import React from 'react'
import { Typography, makeStyles } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors'

const useStyles = makeStyles({
    myTypoStyles: {
        backgroundColor: blue[600],
        color: 'white',
        borderRadius: '8%',
        fontSize: '1.3rem'
    },
    othersTypoStyles: {
        backgroundColor: grey[300],
        color: 'black',
        borderRadius: '8%',
        fontSize: '1.3rem'
    },
})

function Messenger({ username, text, signInUsername }) {
    const classes = useStyles();

    return (
        username == signInUsername ? (
            <div className="my-messages">
                <Typography className={classes.myTypoStyles}>
                    {text}
                </Typography>
            </div>
        ) : (
            <div className="others-messages" >
                <Typography className={classes.othersTypoStyles}>
                    {text}
                </Typography>
            </div>
        )
    )
}

export default Messenger
