import { Router } from "express";
import { Blog } from "../src/models/blog.js";
const router = Router();

router.delete("/comment/:blogId/:commentId", async (req, res) => {
    try {
        const { blogId, commentId } = req.params;
       //console.log(blogId, commentId);
        
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

        res.json({ success: true, comments: blog.comments });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ success: false, message: 'Failed to delete comment' });
    }
});

router.get("/edit/:id", async (req, res) => {
        const blog = await Blog.findById(req.params.id);
        return res.render("editBlog",{blog, user: req.user});
})
router.delete("/edit/delete/:id", async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.post("/edit/:id", async (req, res) => {
    try {
        // Log the incoming request body
        //console.log(req.body);
        
        // Destructure title and content from request body
        const { title, content } = req.body;

        // Validate inputs (basic validation)
        if (!title || !content) {
            return res.status(400).render("editBlog", {
                blog: { _id: req.params.id, title, content },
                user: req.user,
                error: "Title and content are required."
            });
        }

        // Update the blog post in the database
        const blog = await Blog.findByIdAndUpdate(req.params.id, { title, content }, { new: true });

        // If the blog post is not found, send a 404 response
        if (!blog) {
            return res.status(404).render("error", { message: "Blog not found." });
        }

        // Render the updated blog post
        return res.render("editBlog", { blog, user: req.user });
    } catch (error) {
        console.error("Error updating blog:", error);
        // Handle any other errors (e.g., database issues)
        return res.status(500).render("editBlog", {
            blog: { _id: req.params.id, title, content },
            user: req.user,
            error: "An error occurred while updating the blog."
        });
    }
});



router.delete("/delete/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ success: false, message: 'Failed to delete blog' });
    }
})





















export default router;