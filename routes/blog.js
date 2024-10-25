import { Router } from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { Blog } from "../src/models/blog.js";
const router = Router();

   // Configuration
   cloudinary.config({ 
    cloud_name:process.env.cloudinary_cloud_name, 
    api_key:process.env.cloudinary_api_key,  // Click 'API keys' above to copy your API key 
    api_secret:process.env.cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null,   uniqueSuffix+ '-' +file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/like/:id", async (req, res) => {
    // console.log(req.body);

    try {
        const { liked } = req.body; // Destructure the like value from req.body

        // Check if the like value is true or false
        const update = liked ? { $inc: { likes: 1 } } : { $inc: { likes: -1 } };
        
        const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });

        // Return the updated number of likes
        res.json({ likes: blog.likes });
    } catch (error) {
        res.status(500).json({ message: 'Error updating likes' });
    }
});


router.post("/comment/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        const { username, content } = req.body;

        // Assuming you have a method to add a comment to the blog
        const blog = await Blog.findById(blogId);
        blog.comments.push({ username, content });
        await blog.save();

        res.json({ comments: blog.comments }); // Send back the updated comments array
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment' });
    }
});


router.get("/add-new", (req, res) => {
    
    return res.render("addBlog",{
        user: req.user,
        
    });
});
router.get("/view/:id", async (req, res) => {
   const blog=await Blog.findById(req.params.id).populate("author");
    // console.log(blog);
    res.render("viewBlog",{
        user: req.user,
        blog,
    })

})
router.post("/post-comment/:id", async (req, res) => {})

router.post("/add", upload.single("coverImage"), async (req, res) => {

    const uploadResult = await cloudinary.uploader.upload(req.file.path);
    // console.log("Upload result:", uploadResult);
    const{title,content}=req.body;
       Blog.create({
           title,
           content,
           coverImage: uploadResult.secure_url,
           author: req.user._id
       })

//   console.log("Body:", req.body); // Logs non-file fields
//   console.log("File:", req.file); // Logs uploaded file details

  fs.unlink(req.file.path,
    (err => {
        if (err) console.log(err);
        else {
            console.log("\nDeleted file: example_file.txt");

        
        }
    }));

  return res.redirect("/");
});

export default router;
