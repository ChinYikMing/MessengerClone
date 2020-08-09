import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase/config';
import { CircularProgress } from '@material-ui/core';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import DeleteFriendModal from '../modal/DeleteFriendModal';

const useStyles = makeStyles({
    deleteButtonStyle: {
        '&:hover': {
            cursor: 'pointer'
        }
    },
    linkStyle: {
        textDecoration: 'none'
    }
});

const signOut = () => {
    auth.signOut().then(() => {
        console.log('Sign Out successfully')
    });
}

function FriendList({ setCurrentFriendUid, setCurrentFriendDisplayName, setCurrentFriendAvatar }) {
    const classes = useStyles();
    const [searchVal, setSearchVal] = useState('');
    const [uid, setUid] = useState('');
    const [loading, setLoading] = useState(true);
    const [friendsList, setFriendsList] = useState([]);
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [otherUid, setOtherUid] = useState('');
    const [otherDisplayName, setOtherDisplayName] = useState('');
    const [mutualMessagesRefUid, setMutualMessagessRefUid] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const { uid } = user;
            setUid(uid);

            let friends = [];
            const friendsRef = db.collection('users').doc(uid).collection('friends');

            const unsubscribe = friendsRef.onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const id = doc.id;
                    const { displayName, avatar, mutualMessagesRefUid } = doc.data();

                    if (id === uid) {
                        setUsername(displayName);
                        setAvatar(avatar);
                    }

                    friends.push({ displayName, id, avatar, mutualMessagesRefUid });
                });

                setFriendsList(friends);

                if (loading) {
                    setLoading(false);
                    friends = [];
                }
            })

            return () => unsubscribe();
        }
    }, [])

    const modalHandler = (friendUid, friendDisplayName, mutualMessagesRefUid) => {
        setIsOpen(true);

        //set otherDisplayName to pass to modal
        setOtherDisplayName(friendDisplayName);

        //set otherUid to pass to modal
        setOtherUid(friendUid);

        //set mutualMessagesRefUid to pass to modal
        setMutualMessagessRefUid(mutualMessagesRefUid);
    }

    const selectFriendHandler = (friendUid, friendDisplayName, friendAvatar) => {
        setCurrentFriendUid(friendUid);
        setCurrentFriendDisplayName(friendDisplayName);
        setCurrentFriendAvatar(friendAvatar);
    }

    return (

        <div className="friends-list-container">
            {
                loading ? (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </div >
                ) : (
                        <>
                            <DeleteFriendModal
                                open={isOpen}
                                setIsOpen={setIsOpen}
                                uid={uid}
                                username={username}
                                avatar={avatar}
                                selectFriendHandler={selectFriendHandler}
                                otherUid={otherUid}
                                otherDisplayName={otherDisplayName}
                                mutualMessagesRefUid={mutualMessagesRefUid}
                            />
                            <div className="search-box">
                                <input
                                    type="text"
                                    placeholder="搜索 Messenger"
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                />
                            </div>
                            <div><h2>Your friends List</h2></div>
                            < div className="friends-list-entry" key={uid}>
                                <div onClick={() => selectFriendHandler(uid, username, avatar)}>
                                    <a href={`#${uid}`} id={uid} style={{ textDecoration: 'none', color: 'black' }}>
                                        My Profile
                                    </a>
                                </div>
                            </div>
                            {friendsList.map(friend =>
                                friend.displayName.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1 &&
                                friend.displayName !== username &&
                                < div className="friends-list-entry" key={friend.id}>
                                    <div onClick={() => selectFriendHandler(friend.id, friend.displayName, friend.avatar)}>
                                        <a href={`#${friend.id}`} id={`${friend.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            {friend.displayName}
                                        </a>
                                    </div>
                                    <div><PersonAddDisabledIcon
                                        onClick={() => modalHandler(friend.id, friend.displayName, friend.mutualMessagesRefUid)}
                                        className={classes.deleteButtonStyle} />
                                    </div>
                                </div>
                            )}
                            <div className="signout-button">
                                <Link to='/' className={classes.linkStyle}>
                                    <Button
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => signOut()}
                                    >
                                        Sign Out
                                    </Button>
                                </Link>
                            </div>

                        </>
                    )
            }
        </div>
    )
}

export default FriendList

