import React, { useState, useEffect } from 'react'
import { auth } from '../firebase/config';

function FriendProfile({ currentFriendDisplayName, currentFriendAvatar }) {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');

    useEffect(() => {
        const user = auth.currentUser;
        if(user){
            const displayName = user.displayName;
            setUsername(displayName);
        }
    }, [])

    const uploadHandler = (e) => {
        e.preventDefault();
        console.log(avatar);
    }

    return (
        <div className="friend-profile-container">
            <img className="profile-image" src={currentFriendAvatar} />
            <div className="profile-name">{currentFriendDisplayName}</div>
            {currentFriendDisplayName === username ? (
                <form className="avatar-upload-form" onSubmit={uploadHandler}>
                    <input 
                        type="file" 
                        id="avatar" 
                        name="avatar" 
                        accept="image/png, image/jpeg"
                        onChange={e => setAvatar(e.target.value)}
                    />
                    <button type="submit">Upload</button>
                </form>
            ) : null
            }
        </div>
    )
}

export default FriendProfile
