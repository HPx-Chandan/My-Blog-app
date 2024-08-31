import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from '../components/PostAuthor';

const PostItem = (post) => {
  const shortDesc =
    post.desc.length > 90 ? post.desc.substr(0, 90) + '......' : post.desc;
  const shortTitle =
    post.title.length > 21 ? post.title.substr(0, 21) + '......' : post.title;

  return (
    <article className="post">
      <div className="post_thumbnail">
        <Link to={`/posts/${post.postID}`}>
          <img src={post.thumbnail} alt={post.title} />
        </Link>
      </div>
      <div className="post_content">
        <Link to={`/posts/${post.postID}`}>
          <h3>{shortTitle}</h3>
          <div
            className="descH"
            dangerouslySetInnerHTML={{ __html: shortDesc }}
          />
        </Link>
        <div className="post_footer">
          <PostAuthor creator={post.creator} date={post.createdAt} />

          <Link
            to={`/posts/categories/${post.category}`}
            className="btn category"
          >
            {post.category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
