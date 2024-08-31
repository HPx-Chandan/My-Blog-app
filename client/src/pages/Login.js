import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { UserContext } from '../context/userContext';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
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

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/login`,
        userData,
      );
      const logedInUser = await response.data;
      if (!logedInUser) {
        setError("Couldn't login user. Please try again.");
      }

      setCurrentUser(logedInUser);
      localStorage.setItem('user', JSON.stringify(logedInUser));
      navigate('/');
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form
          className="form login_form"
          onSubmit={loginUser}
          autoComplete="off"
        >
          {error && <p className="form_error-message">{error}</p>}
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          ></input>
          <input
            type="password"
            placeholder="Eenter Your Password"
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          ></input>
          <button type="submit" className="btn primary">
            Sign In
          </button>
        </form>
        <small>
          I don't have an account? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
