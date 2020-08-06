import React from 'react';
import './home.css'
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
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

function Home() {
    const classes = useStyles();

    return (
        <div className="home-container">
            <img
                src="https://seeklogo.com/images/F/facebook-messenger-logo-D0521B20FE-seeklogo.com.png"
                alt="messenger logo"
                className="messenger-logo"
            />
            <div>
                <Link to='/signin' className={classes.linkStyle}>
                    <Button
                        variant="contained" color="primary"
                        className={classes.buttonStyle}
                    >
                        Sign In
                    </Button>
                </Link>

                <Link to='signup' className={classes.linkStyle}>
                    <Button
                        variant="contained" color="primary"
                        className={classes.buttonStyle}
                    >
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Home
