import React from 'react';
import LoadingGiF from '../images/loader/loader.gif';

const Loader = () => {
  return (
    <div className="loader">
      <div className="loader_image">
        <img src={LoadingGiF} alt=""></img>
      </div>
    </div>
  );
};

export default Loader;
