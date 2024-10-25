import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const commentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define the Blog schema
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,  // Referencing the User model
    ref: 'USER',
    required: true
  },
  tags: {
    type: [String],  // An array of tags for categorizing the blog
    default: []
  },
  comments: [commentSchema],  // Embedded sub-documents for comments
  likes: {
    type: Number,
    default: 0  // Keep track of likes on the blog post
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  },
  coverImage: {
    type: String,
  }
});

// Middleware to set the updatedAt field before saving the document
blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

export { Blog };