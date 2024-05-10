'use client'

import React from 'react'
import { useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';

const Card = () => {

  const [wordCount, setWordCount] = useState(0);
  const [data, setdata] = useState({
    title: '',
    info: '',
  });
  const [alert, setAlert] = useState('')
  const maxCharacters = 100;

  const handleInputChange = (e) => {
    
     if(e.target.name === 'title'){
      const inputText = e.target.value;
        setWordCount(inputText.length);
     }
     
     setdata((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  
  }
 
  const handleOnClick = async (e) => {
    e.preventDefault();
   
    try {
    
      const response = await axios.post('http://localhost:5000/blogs', data);
  
      if (response.status === 201) {
        console.log('Blog posted successfully!');
        showAlert();
        setdata({})
        setWordCount(0)
      } else {
        console.error('Failed to post blog:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error posting blog:', error);
    }
  };  

 
  function showAlert() {
    setAlert('Blog added successfully !!');

    setTimeout(() => {
      setAlert('');
    }, 2000);
  }

  return (
    <>
    <Header />
    <div className='text-black text-center text-xl text-semibold'>{alert}</div>
    <div className='flex justify-center w-full'>
    
    <form className='m-4 mt-10 border border-gray-500 h-auto  w-auto bg-white rounded relative sm:w-3/6 '>
      <p className='text-black font-semibold text-2xl p-6'>Write Your Blog here</p>

      <label className='text-gray-500 px-6 flex flex-wrap' >This is the title that will be displayed at the top of your Blog.</label>
      <input 
      type="text"
      name="title"
      value={data?.title ||''}
      className='w-3/4 border-b-2 border-red-400 m-6 mb-2 outline-none text-black'
      placeholder='Title'
      onChange={handleInputChange}
      maxLength={maxCharacters} 
      required >
      </input>

      <div className='w-3/4 flex justify-end'>
      <p className='text-gray-500'>{wordCount} / {maxCharacters}</p>
      </div>

      <label className="text-gray-500 px-6">Type the Info here</label>
      <textarea
      name='info'
      value={data?.info  || ''}
      onChange={handleInputChange}
      className="w-3/4 border-2 rounded border-red-400 m-6 mb-2 p-1 outline-none text-black min-h-28"
      required >
      </textarea>
      <hr className="bg-black h-0.5"></hr>
    <div className='w-full py-2 px-10 flex justify-end sm:py-6'>
        <button onClick={handleOnClick} className="text-red-600 font-semibold">Publish</button>
    </div>
    
    </form>
  </div>
  </>
  )
}

export default Card;
