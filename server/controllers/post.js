import {Blog}  from "../models/postBlog.js"; 

export const getblogs  = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).send(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const postblog = async (req, res) => {
  const {title, info} = req.body;
  try {

    const newBlog = new Blog({ 
      heading : title,
      message : info,
    });
    await newBlog.save();
    res.status(201).json({message: 'Blog created successfully'})

  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
