import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { RiImageEditFill } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';

import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Loader from './../components/loader';
import DefaAvatar from './../images/user/avatar-default.jpeg';

const UserProfile = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [avatar, setAvatar] = useState(currentUser.user.avatar);
  const [name, setName] = useState(currentUser.user.name);
  const [email, setEmail] = useState(currentUser.user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState(null);
  const [isAvatartuched, setIsAvatartuched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  console.log(confirmPassword, currentPassword);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const changeAvatarHandler = async () => {
    setIsLoading(true);
    setIsAvatartuched(false);
    try {
      const userData = new FormData();
      userData.set('avatar', avatar);

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        userData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      const deepCurrentUser = JSON.parse(JSON.stringify(currentUser));

      deepCurrentUser.user.avatar = response.data.data.user.avatar;
      console.log(response);

      setAvatar(response.data.data.user.avatar);
      setCurrentUser(deepCurrentUser);
    } catch (error) {
      setError(error.response.data.message);
    }
    setIsLoading(false);
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        { name, email, currentPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      console.log(response.data);

      setCurrentUser(response.data);
      navigate(0);
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // console.log(currentUser.user.id);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser.user.id}`} className="btn ">
          My Posts
        </Link>

        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img
                src={avatar}
                alt="User avatar"
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop if default image also fails
                  e.target.src = DefaAvatar; // Set the fallback image
                }}
              />
            </div>
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="image/png, image/jpeg"
              />
              <label
                htmlFor="avatar"
                onClick={() => {
                  setIsAvatartuched(true);
                }}
              >
                <RiImageEditFill />
              </label>
            </form>
            {isAvatartuched && (
              <button
                className=" profile_avatar_btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1> {currentUser.user.name} </h1>
          {/* form to update user details */}
          <form className="form profile_form">
            {error && <p className="form_error-message"> {error} </p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            ></input>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Crrent Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            ></input>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></input>
            <button
              // type="submit"
              className="btn primary"
              onClick={updateUserDetails}
            >
              Update details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
