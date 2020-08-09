import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
    closeButtonStyle: {
        backgroundColor: red[600],
        padding: '5px',
        '&:hover': {
            backgroundColor: red[500]
        }
    },
})

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#3FC59D',
    width: '300px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    zIndex: 1000,
};

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

function AcceptFriendModal({ open, setIsOpen, otherDisplayName }) {
    const classes = useStyles();

    if (!open) return null;

    return (
        <>
            <div style={OVERLAY_STYLE}></div>
            <div style={MODAL_STYLE}>
                <div style={{textAlign: 'center'}}>
                    You and <span style={{ fontWeight: 'bold', color: '#000' }}>{otherDisplayName}</span> are now friend!
                </div>
                <div>
                    <Button
                        size="small"
                        className={classes.closeButtonStyle}
                        onClick={() => setIsOpen(false)}
                    >
                        close
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AcceptFriendModal
