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

export const deleteBlog = async (req, res) => {
  const postId = req.params.postId; 
  try {
    const deletedBlog = await Blog.findByIdAndDelete(postId);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });  
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

