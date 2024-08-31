import React, { useEffect, useContext } from 'react';

import { UserContext } from '../context/userContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const DeletePosts = ({ postId }) => {
  const id = postId;
  console.log(id);

  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, []);

  const removePost = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      if (response.status == 204) {
        if (location.pathname == `/myposts/${currentUser.user.id}`) {
          navigate(0);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link
      onClick={() => {
        removePost(id);
      }}
      className="btn sm danger"
    >
      Delete
    </Link>
  );
};

export default DeletePosts;
