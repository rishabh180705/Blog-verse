import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import auth from "../routes/user.js";
import blogRoute from "../routes/blog.js"; // Update the path as needed
import { checkForAuth } from "../middlewares/authentication.js"; // Update the path as needed
import cookieParser from "cookie-parser";
import {Blog} from "../src/models/blog.js"; // Update the path as needed
import myblogRoute from "../routes/myblog.js"; // Update the path as needed

// Convert __filename and __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(checkForAuth('token')); // Check for authentication middleware

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Ensure the correct path to the views folder
app.set('views', path.join(__dirname, 'views')); // Use __dirname
console.log("Views directory:", path.join(__dirname, 'views'));
app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
    fs.readdir(path.join(__dirname, 'views'), (err, files) => {
        if (err) {
            console.error("Error reading views directory:", err);
            return res.status(500).send("Error reading views directory");
        }
        //console.log("Files in views directory:", files);
        res.render("home",{
            user: req.user,
            blogs: allBlogs,
        });
    });
});

app.use('/user',auth)
app.use('/blog',blogRoute)
app.use('/myblog',myblogRoute)

// Export the app
export { app };
