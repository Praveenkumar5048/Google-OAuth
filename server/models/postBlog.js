import mongoose from "mongoose";

// Schema for Blog Posts
const blogSchema = mongoose.Schema({
    heading: { type: String, required: true},
    message: { type: String, required: true},
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.model('Blog', blogSchema);

// Schema for Users
const userSchema = mongoose.Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    profileImage:{type: String, required: false },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);


