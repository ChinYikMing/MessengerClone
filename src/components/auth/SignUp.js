import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import '../formik/formik.css';
import FormikControl from '../formik/FormikControl';
import { Redirect } from 'react-router-dom';
import { auth, db } from '../firebase/config';

function SignUp() {
    const [uid, setUid] = useState('');
    const [error, setError] = useState('');
    const defaultAvatar = "https://images.unsplash.com/photo-1463725876303-ff840e2aa8d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80";

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;
                setUid(uid);
            } else {
                setUid('');
            }
        })
    }, []);

    const initialValues = {
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    };

    const validationSchema = Yup.object({
        email: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
        confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Passwords must match').required('Required'),
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required')
    });

    const onSubmit = values => {
        const { email, password, firstName, lastName } = values;
        auth.createUserWithEmailAndPassword(email, password).then(res => {
            res.user.updateProfile({
                displayName: `${lastName} ${firstName}`,
                photoURL: defaultAvatar
            }).then(() => {
                console.log("update user's displayName successfully");
            }).catch(err => {
                console.log("update user's displayName failed", err);
            });
            return res.user.uid;
        }).then(uid => {
            db.collection('users').doc(uid).set({
                displayName: `${lastName} ${firstName}`,
                avatar: defaultAvatar
            });
            return uid;
        }).then(uid => {
            db.collection('users').doc(uid).collection('friends').doc(uid).set({
                displayName: `${lastName} ${firstName}`,
                friendUid: uid,
                mutualMessagesRefUid: uid,
                avatar: defaultAvatar
            }).then(() => {
                    console.log("Document successfully written!");
            }).catch(err => {
                    console.log("Error writing document", err);
            })
        }).then(() => {
            console.log("Create account successfully");
        }).catch(err => {
            console.log("create account failed", err);
            setError(err.message);
        })
    }

    if (uid)
        return <Redirect to='/message' />

    return (
        <>
            <div className="form">
                <span>Create account</span>
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
                        <FormikControl
                            control='input'
                            name='confirmPassword'
                            label='Re-enter password'
                            type='password'
                        />
                        <FormikControl
                            control='input'
                            name='firstName'
                            label='Firstname'
                            type='text'
                        />
                        <FormikControl
                            control='input'
                            name='lastName'
                            label='Lastname'
                            type='text'
                        />
                        <button type="submit" className="create-account-button">
                            Create your Messenger account
                        </button>
                    </Form>
                </Formik>
                {error && <div className="error">{error}</div>}
            </div>
        </>
    )
}

export default SignUp;
