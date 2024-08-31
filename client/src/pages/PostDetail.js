import React, { useState, useEffect, useContext } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/loader';
import DeletePosts from './DeletePosts';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();

  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
          // {
          //   headers: {
          //     Authorization: `Bearer ${currentUser.token}`,
          //   },
          // },
        );

        setPost(response.data.data);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [id, currentUser]);

  if (isLoading) {
    return <Loader />;
  }

  if (error && error.message === 'User not authenticated') {
    return <p>Please log in to view this post.</p>;
  }
  // console.log(post);
  // console.log(post.creator._id);
  // console.log(currentUser.user.id);

  return (
    <section className="post-detail">
      {error && <p className="error">{error.message}</p>}
      {post && (
        <div className="container post-detail_container">
          <div className="post-detail_header">
            <PostAuthor creator={post.creator} date={post.createdAt} />
            {currentUser && currentUser.user.id === post.creator._id && (
              <div className="post-detail_buttons">
                <Link to={`/posts/${id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePosts postId={id} />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div className="post-detail_thumbnail">
            <img src={post.thumbnail} alt="Post Thumbnail" />
          </div>

          <div
            className="desc"
            dangerouslySetInnerHTML={{ __html: post.description }}
          />
        </div>
      )}
    </section>
  );
};

export default PostDetail;
