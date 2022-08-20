import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Blogcard.css'

const Blogcard = ({ blog }) => {

  let edit = JSON.parse(localStorage.getItem('edit'))
  var option
  if (edit) {
    option = <>
      <div className="flex mt-3">
        <button className="block p-1 text-white rounded text-xs font-medium bg-indigo-500 hover:bg-indigo-600" value={blog._id} img={blog.img} title={blog.title} blog={blog.blog} onClick={(e) => { EditBlog(e) }}>Edit</button>
        <button className="block p-1 text-white ml-2 rounded text-xs font-medium bg-red-500 hover:bg-red-600" value={blog._id} onClick={(e) => { Delete(e) }}>Delete</button>
      </div>
    </>
  }

  const Delete = (e) => {
    let id = e.target.value

    fetch('users/blogs/delete' + id).then(res => res.json()).then((data) => {
      console.log(data);
      navigate(`/myblogs`)
    })
  }

  const EditBlog = (e) => {
    let blog = {
      id: e.target.value,
      blog: e.target.getAttribute("blog"),
      title: e.target.getAttribute("title"),
      img: e.target.getAttribute("img")
    }

    localStorage.setItem('myblog', JSON.stringify(blog))
    navigate(`/editblog`)
  }

  const navigate = useNavigate()
  const FetchBlog = (e) => {
    let id = e.target.value
    console.log(e.target.value);
    fetch("users/blog", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id
      })
    }).then(response => response.json())
      .then(data => {
        localStorage.setItem('myblog', JSON.stringify(data.blogdata))
        id = data.blogdata.title
        console.log(data);
        console.log(id);
        navigate(`/blog/${id}`)
      })
  }

  var src = "halo"

  return (
    <figure className="mx-3 my-2 relative flex bg-white rounded-md md:p-0 my-1 shadow-md w-full h-24 sm:h-36 content-center">
      <img className="w-24 h-auto md:w-48 md:h-auto rounded-none mx-auto object-cover" src={"data:image/jpg;base64," + blog.img} alt="" width="384" height="512" />
      <div className="px-2 sm:px-8 w-full flex flex-col text-left items-center justify-center">
        <blockquote>
          <button className="sm:text-[20px] text-sm font-medium hover:underline underline-offset-2 cursor-pointer focus:outline-none" value={blog._id} onClick={(e) => { FetchBlog(e) }}>
            {blog.title}
          </button>
        </blockquote>
        {option}
      </div>
    </figure>
  )
};

export default Blogcard;