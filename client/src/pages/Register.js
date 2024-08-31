import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { UserContext } from '../context/userContext';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    setUserData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });

    // console.log(e.target.value);
  };

  // const submitHandler = (e) => {
  //   console.log(e);
  //   e.preventDefault();
  // };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/register`,
        userData,
       
      );

      const newUser = await response.data;
      // console.log(newUser);

      if (!newUser) {
        setError("Couldn't register user. Please try again.");
      }

      setCurrentUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      navigate('/');
    } catch (error) {
      // console.log('Error Details:', error);
      setError(error.response.data.message);
    }
  };

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form
          className="form register_form"
          autoComplete="off"
          onSubmit={registerUser}
        >
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          ></input>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          ></input>
          <input
            type="password"
            placeholder="Eenter Your Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          ></input>
          <input
            type="password"
            placeholder="Re-Eenter Your Password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={changeInputHandler}
          ></input>
          <button type="submit" className="btn primary">
            Register
          </button>
        </form>
        <small>
          Already have an account? <Link to="/login">Sign In</Link>{' '}
        </small>
      </div>
    </section>
  );
};

export default Register;
