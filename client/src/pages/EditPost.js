import React, { useState, useEffect, useContext } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { UserContext } from '../context/userContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/loader';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const POST_CATEGORIES = [
    'Agriculture',
    'Business',
    'Education',
    'Entertainment',
    'Art',
    'Investment',
    'Uncategorised',
    'Weather',
  ];

  const { id } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }

    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        );
        const postData = response.data.data;
        console.log(postData);

        setTitle(postData.title);
        setCategory(postData.category);
        setDescription(postData.description);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    };
    getPost();
  }, []);

  const updatePost = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );
      console.log(response);

      if (response.status == 201) {
        navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="create-post">
      <div className=" container create-post_contianer ">
        <h2 className="form-title">Edit Post</h2>
        {error && <p className="form_error-message"> {error} </p>}
        <form onSubmit={updatePost} className="form reate-post_form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <div className="editorText">
            <CKEditor
              editor={ClassicEditor}
              data={description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
            />
          </div>

          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/png, image/jpeg"
          />

          <button type="submit" className="btn primary">
            Update Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
