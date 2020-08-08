import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import '../formik/formik.css';
import FormikControl from '../formik/FormikControl';
import { Button, makeStyles } from '@material-ui/core';
import { Link, useHistory, Redirect } from 'react-router-dom';
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
    facebookSignInButton: {
        width: '300px',
        color: '#000',
        backgroundColor: blue[600],
        '&:hover': {
            backgroundColor: blue[500]
        }
    }
})

function SignIn() {
    const classes = useStyles();
    const history = useHistory();
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
            history.push('/message');
        }).catch(err => {
            console.log(err);
            setError(err.message);
        })
    }

    const provider = new firebase.auth.FacebookAuthProvider();
    const facebookSignIn = () => {
        firebase.auth().signInWithRedirect(provider);
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
                    className={classes.facebookSignInButton}
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
        </>
    )
}

export default SignIn;
