import React, { useState, useContext, useEffect } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import Loader from './../components/loader';
import axios from 'axios';

const CreatePosts = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorised');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');

  const navigate = useNavigate();

  const { currentUser } = useContext(UserContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, []);

  const createPost = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);
    postData.set('thumbnail', thumbnail);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts/`,
        postData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        },
      );

      if (response.status == 201) {
        navigate('/');
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="create-post">
      <div className=" container create-post_contianer ">
        <h2 className="form-title">Create Post</h2>
        {error && <p className="form_error-message"> {error} </p>}
        <form className="form reate-post_form" onSubmit={createPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <select
            name="category"
            value={category}
            defaultValue={'Uncategorised'}
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
            Create Post
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePosts;
