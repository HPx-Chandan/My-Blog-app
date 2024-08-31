import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const PostAuthor = ({ creator, date }) => {
  const user = creator;
  console.log(user);

  const createdTime = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div>
      <Link to={`/posts/users/${user._id}`}>
        <div className="post_author_avatar ">
          <img className="post_avatar_img" src={user.avatar} alt="img" />
          <div className="name_date">
            <h5>By : {user.name} </h5>
            <small>{createdTime}</small>
            {/* <small>{date.split('T')[0]}</small> */}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostAuthor;
