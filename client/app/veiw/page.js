'use client'

import React from 'react'
import { useState, useEffect } from 'react';
import Header from "../components/Header";

const Page = () => {

    const [posts, setPosts] = useState([])
    const [flag, setFlag] = useState(true);

   useEffect( ()=>{
    const fetchPost = async () => {
        try {
          const response = await fetch('http://localhost:5000/veiw');
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.log('could not fetch data');
        }
      }
      fetchPost()
   } ,[flag])
  
   const handleDelete = async (postId) => {
        
    try {
      
      const response = await fetch(`api/blogs/${postId}`, {method: 'DELETE'});
  
      if (response.ok) {
        console.log('Blog deleted successfully!');
        setFlag(!flag);
      } else {
        console.error('Failed to delete blog:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  return (

    <>
      <Header />
      <h1 className="text-center text-3xl font-bold my-8 md:text-4xl">Blog Posts</h1>
  
      <div className="flex gap-6 w-3/4 mx-auto my-2 flex-wrap sm:w-2/3">
        {posts.map((post) => (
          <div key={post._id} className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-orange-500 text-xl font-bold mb-4">{post.heading}</h2>
            <p className="text-gray-800 sm:text-lg">{post.message}</p>
            <div className='flex justify-center'>
            <button className="bg-orange-500 w-16 h-10 rounded mt-2 mr-1" type="submit">Edit</button>
            <button onClick={ () => handleDelete(post._id)} className="bg-orange-500 w-16 h-10 rounded mt-2 ml-1" type="submit">Delete</button>
            </div>
          </div>
        ))}
      </div>


    </>
  

  )
}


export default Page