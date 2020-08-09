import React from 'react'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors'

const useStyles = makeStyles({
    closeButtonStyle: {
        backgroundColor: red[600],
        padding: '5px',
        '&:hover': {
            backgroundColor: red[500]
        }
    }
})

const MODAL_STYLE = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    width: '300px',
    height: '300px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
};

const TOP_STYLE = {
    backgroundColor: '#3FC59D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
}

const BOTTOM_STYLE = {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%'
}

const MAIN_TEXT_STYLE = {
    fontSize: '1.2rem',
    fontWeight: 'bold'
}

const SUB_TEXT_STYLE = {
    fontSize: '1rem',
}

const OVERLAY_STYLE = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, .7)',
    zIndex: 1000
}

function AddFriendModal({ open, setIsOpen, otherDisplayName }) {
    const classes = useStyles();

    if (!open) return null;

    return (
        <>
            <div style={OVERLAY_STYLE}></div>
            <div style={MODAL_STYLE}>
                <div style={TOP_STYLE}>
                    <CheckCircleOutlineIcon fontSize="large" />
                </div>
                <div style={BOTTOM_STYLE}>
                    <div style={MAIN_TEXT_STYLE}>Great!</div>
                    <div style={SUB_TEXT_STYLE}>Your request successfully sent to <span style={{fontWeight: 'bold'}}>{otherDisplayName}</span></div>
                    <Button
                        size="small"
                        className={classes.closeButtonStyle}
                        onClick={() => setIsOpen(false)}
                    >
                        <CloseIcon fontSize="small" /> Close
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AddFriendModal
