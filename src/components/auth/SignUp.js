import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import '../formik/formik.css';
import FormikControl from '../formik/FormikControl';
import { Redirect, useHistory } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import firebase from 'firebase/app';

function SignUp() {
    const history = useHistory();
    const [uid, setUid] = useState('');

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
        firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
            return res.user.updateProfile({
                displayName: lastName + ' ' + firstName
            })
        }).then(() => {
            history.push('/');
        }).catch(err => {
            console.log(err);
        })
    }

    if(uid)
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
                {/* {authError && <div className="error">{authError}</div>} */}
            </div>
        </>
    )
}

export default SignUp;
