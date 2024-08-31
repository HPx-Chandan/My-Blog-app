import React, { useState, useEffect } from 'react';
import PostItem from './../components/PostItem';
import axios from 'axios';
import Loader from './../components/loader';
import { useParams } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthorPosts = () => {
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

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

        setPosts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
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
  console.log(posts);

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container posts_contaianer">
          {posts.map((post) => (
            <PostItem
              key={post._id}
              postID={post._id}
              thumbnail={post.thumbnail}
              category={post.category}
              title={post.title}
              desc={post.description}
              creator={post.creator}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      ) : (
        <h1 className=" center">NO POSTS</h1>
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
export default AuthorPosts;
