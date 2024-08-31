import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/loader';

import { useLocation, useNavigate } from 'react-router-dom';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [Upage, setUPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pageParam = query.get('page');
    if (pageParam) {
      setUPage(Number(pageParam));
    }
  }, [location.search]);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/?page=${Upage}`,
        );

        setAuthors(response.data.authors);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getAuthors();
  }, [Upage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setUPage(newPage);
      navigate(`?page=${newPage}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map((author) => {
            console.log(author);

            return (
              <Link
                key={author._id}
                to={`/posts/users/${author._id}`}
                className="author"
              >
                <div className="author_avatar">
                  <img src={author.avatar} alt={`Image of ${author.name}`} />
                </div>
                <div className="author_info">
                  <h4>{author.name}</h4>
                  <p>{author.posts}</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center"> No Users / Authors Found</h2>
      )}

      <div className="pagination">
        <button
          onClick={() => handlePageChange(Upage - 1)}
          disabled={Upage === 1}
          className="pagination-button btn primary"
        >
          Previous
        </button>
        <span className="page-number">
          Page {Upage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(Upage + 1)}
          disabled={Upage === totalPages}
          className="pagination-button btn primary"
        >
          Next Page
        </button>
      </div>
    </section>
  );
};

export default Authors;
