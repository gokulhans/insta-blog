import React from 'react';
import { Link } from 'react-router-dom'
import './Singlepost.css'


const Singlepost = () => {
  let blog = JSON.parse(localStorage.getItem('myblog'))


  return <div>
    <div className="bg-white p-2" >
      <img className="w-screen h-80 object-cover" src={"data:image/jpg;base64," + blog.img} alt="" />
      <div className="bg-white lg:mx-48 sm:px-8 md:px-8 pb-16 mt-4 lg:pt-4 lg:shadow-md">
        <h1 className="singlePostTitle ">
          {blog.title}
        </h1>
        <div className="px-2">
          <div className="singlePostInfo px-2">
            <span>
              Author:
              <b className="singlePostAuthor">
                <Link className="link" to="/posts?username=Safak">
                  {blog.author}
                </Link>
              </b>
            </span>
            <span>1 day ago</span>
          </div>
          <p className="text-lg">
            {blog.blog}
          </p>
          <div className="sm:mx-64">
            <img className="mt-8 object-cover" src={"data:image/jpg;base64," + blog.img} alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Singlepost;
