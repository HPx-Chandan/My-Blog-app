import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '../context/userContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Loader from './../components/loader';
import DeletePost from './DeletePosts';

const Dashboard = () => {
  const [posts, setPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pageParam = query.get('page');
    if (pageParam) {
      setPage(Number(pageParam));
    }
  }, [location.search]);

  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/users/${id}?page=${page}`,
        );

        const posts = response.data.data;
        setPost(posts);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      navigate(`?page=${newPage}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length > 0 ? (
        <div className="container dashboard_container">
          {posts.map((post) => {
            console.log(post);

            return (
              <article key={post._id} className="dashboard_post">
                <div className="dashboard_post-info">
                  <div className="dashboard_post-thumbnail">
                    <img src={post.thumbnail} alt="" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard_post-action">
                  <Link to={`/posts/${post._id}`} className="btn sm ">
                    View
                  </Link>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="btn sm primary"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Posts Found</h2>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="pagination-button btn primary"
        >
          Previous
        </button>
        <span className="page-number">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="pagination-button btn primary"
        >
          Next Page
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
