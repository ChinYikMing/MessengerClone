import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import '../formik/formik.css';
import FormikControl from '../formik/FormikControl';
import { Button, makeStyles } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import { blue } from '@material-ui/core/colors';
import { auth } from '../firebase/config';
import firebase from 'firebase/app';
import FacebookIcon from '@material-ui/icons/Facebook';

const useStyles = makeStyles({
    linkStyle: {
        textDecoration: 'none',
        display: 'flex',
        justifyContent: 'center'
    },
    createAccountButtonStyle: {
        width: '300px',
        backgroundColor: '#E0E3E9',
        color: '#000',
    },
    facebookSignInButtonStyle: {
        width: '300px',
        color: '#000',
        backgroundColor: blue[600],
        '&:hover': {
            backgroundColor: blue[500]
        }
    },
    forgotPasswordButtonStyle: {
        width: '300px',
        backgroundColor: blue[300],
        color: '#000',
        margin: 'auto'
    }
})

function SignIn() {
    const classes = useStyles();
    const [error, setError] = useState('');
    const [uid, setUid] = useState('');

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
            }
        })
    }, []);

    useEffect(() => {
        auth.getRedirectResult().then(function (result) {
            if (result.credential) {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const token = result.credential.accessToken;
                // ...
            }
            // The signed-in user info.
            const user = result.user;
        }).catch(function (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const existingEmail = error.email;
            // The firebase.auth.AuthCredential type that was used.
            const pendingCred = error.credential;
            // ...
            if (errorCode === 'auth/account-exists-with-different-credential') {
                // Lookup existing account’s provider ID.
                return auth.fetchSignInMethodsForEmail(existingEmail)
                    .then(providers => {
                        if (providers.indexOf(firebase.auth.EmailAuthProvider.PROVIDER_ID) !== -1) {
                            // Password account already exists with the same email.
                            // Ask user to provide password associated with that account.
                            const password = window.prompt('Please provide the password for ' + existingEmail);
                            return auth.signInWithEmailAndPassword(existingEmail, password);
                        }
                    })
                    .then(() => {
                        const user = auth.currentUser;
                        // Existing email/password signed in.
                        // Link Facebook OAuth credential to existing account.
                        return user.linkWithCredential(pendingCred);
                    }).then(usercred => {
                        const user = usercred.user;
                        console.log("Account linking success", user);
                    }).catch(err => {
                        console.log("Account linking error", err);
                    });;;
            }
        });
    }, [])

    const initialValues = {
        email: '',
        password: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required('Required'),
        password: Yup.string().required('Required')
    });

    const onSubmit = values => {
        const { email, password } = values;
        firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            console.log('Sign In successfully')
        }).catch(err => {
            console.log(err);
            setError(err.message);
        })
    }

    const facebookSignIn = () => {
        const provider = new firebase.auth.FacebookAuthProvider();
        auth.signInWithRedirect(provider);
    }

    const changePassword = () => {
        const email = window.prompt("Please provide your email address");
        auth.sendPasswordResetEmail(email).then(() => {
            window.alert("Please check your email address and reset the password");
        }).catch(err => {
            window.alert(err.message);
        });
    }

    if (uid)
        return <Redirect to='/message' />

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => facebookSignIn()}
                    className={classes.facebookSignInButtonStyle}
                >
                    <FacebookIcon />Sign in with Facebook
            </Button>
            </div>
            <div className="separator">Or</div>
            <div className="form">
                <span>Sign In</span>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <FormikControl
                            control='input'
                            name='email'
                            label='Email'
                            type='email'
                        />
                        <FormikControl
                            control='input'
                            name='password'
                            label='Password'
                            type='password'
                        />
                        <button type="submit" className="submit-button">Sign In</button>
                    </Form>
                </Formik>
                {error && <div className="error">{error}</div>}
            </div>
            <div className="separator">New to Messenger?</div>
            <Link to='/signup' className={classes.linkStyle}>
                <Button color="primary" variant="outlined" className={classes.createAccountButtonStyle}>
                    Create your Messenger account
                </Button>
            </Link>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button color="primary" variant="outlined" className={classes.forgotPasswordButtonStyle} onClick={() => changePassword()}>
                    Forgot password?
                </Button>
            </div>
        </>
    )
}

export default SignIn;
