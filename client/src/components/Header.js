import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/logo.png';
// import { faBars } from 'react-icons/fa';
import { AiOutlineBars } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';

import { UserContext } from '../context/userContext';

const Header = () => {
  const { currentUser } = useContext(UserContext);

  var a = Boolean;
  if (window.innerWidth > 800) {
    a = true;
  }
  const [isNavShowing, setIsNavShowing] = useState(a);

  const handleResize = () => {
    setIsNavShowing(window.innerWidth > 800 ? true : false);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const [isNavShowing, setIsNavShowing] = useState(
  //   window.innerWidth > 800 ? true : false
  // );

  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };

  return (
    <>
      <nav>
        <div className="container nav_container">
          <Link to="/">
            <img
              className="nav_logo"
              onClick={closeNavHandler}
              src={Logo}
              alt="img"
            />
          </Link>
          {currentUser && isNavShowing && (
            <ul className="nav_menu">
              <li>
                <Link
                  to={`/profile/${currentUser.user.id}`}
                  onClick={closeNavHandler}
                >
                  {currentUser.user.name}
                </Link>
              </li>
              <li>
                <Link to="/create" onClick={closeNavHandler}>
                  Create Post
                </Link>
              </li>
              <li>
                <Link to="/authors" onClick={closeNavHandler}>
                  Authors
                </Link>
              </li>
              <li>
                <Link to="/logout" onClick={closeNavHandler}>
                  Logout
                </Link>
              </li>
            </ul>
          )}
          {/* for not logedin user */}
          {!currentUser && isNavShowing && (
            <ul className="nav_menu">
              <li>
                <Link to="/authors" onClick={closeNavHandler}>
                  Authors
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={closeNavHandler}>
                  Login
                </Link>
              </li>
            </ul>
          )}
          <button
            className="nav_toggla-btn "
            onClick={() => setIsNavShowing(!isNavShowing)}
          >
            {isNavShowing ? <IoClose /> : <AiOutlineBars />}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Header;
