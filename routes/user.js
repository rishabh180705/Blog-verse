import { Router } from "express";
import bcrypt from "bcryptjs";
import { USER } from "../src/models/user.js"; // Ensure the path to the model is correct
import { Blog } from "../src/models/blog.js"; // Ensure the path to the model is correct
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const router = Router();
const secret = process.env.ACCESS_TOKEN_SECRET;

// Helper functions for JWT
function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret); // Verify token using the secret
  } catch (error) {
    return null;
  }
}

function setUser(user) {
  // Generate JWT token with user details
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      username: user.username,
    },
    secret,
    { expiresIn: "6h" } // Set token expiration
  );
}

// Routes
router.get("/myBlogs/:id", async (req, res) => {
    try {
        const userId = req.params.id; // Matches the route parameter
        const blogs = await Blog.find({ author: userId }); // Filter by author's user ID
        
        return res.render("myblog", { user: req.user, blogs: blogs }); // Render 'myblog' template
    } catch (error) {
        console.error('Error fetching user blogs:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
    }
});


// Render Sign In page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// Render Sign Up page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

//logout route
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// Sign In POST route
router.post("/signin", async (req, res) => {
  try {
    const normalizedEmail = req.body.email.toLowerCase();

    // Find the user by email
    const user = await USER.findOne({ email: normalizedEmail });
    if (!user) {
      return res.render("signin", { alert: "Please Sign up First" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.render("signin", { alert: "Wrong Password" });
    }

    // Generate token and set it in the cookie
    const token = setUser(user);
    res.cookie("token", token);

    return res.redirect("/");
  } catch (error) {
    console.error("Error during sign in:", error);
    return res.render("signin", { alert: "An error occurred during sign in." });
  }
});

// Sign Up POST route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const lowerEmail = email.toLowerCase();

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the salt rounds for bcrypt

    // Create the new user in the database
    await USER.create({
      username,
      email: lowerEmail,
      password: hashedPassword,
    });

    // Redirect to sign in page after successful sign up
    return res.redirect("/user/signin");
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.render("signup", { alert: "An error occurred during sign up." });
  }
});

export { router as default, getUser };

