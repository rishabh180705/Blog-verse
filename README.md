# Blog-verse
live at :https://blog-verse-vj3v.onrender.com/
'''Blog Verse is a blogging platform that allows users to create, read, update, and delete posts. It includes authentication and media upload functionalities to offer a full-featured user experience.

Table of Contents
Installation
Features
Technologies
Usage
License
Installation
Clone the repository:


git clone <repository_url>
cd blog-verse
Install dependencies:


npm install
Environment Variables: Create a .env file in the root directory and add the following environment variables:

MONGO_URI - Your MongoDB connection string
JWT_SECRET - A secret key for JSON Web Token encryption
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET - Cloudinary credentials for media uploads
Run the application:

npm start
For development:


npm run dev
Features
User Authentication

Secure user registration and login system with password hashing using bcrypt.
Passwords are stored as hashed values to enhance security, protecting sensitive user information.
JWT-Based Authorization

Routes are protected using JSON Web Tokens, allowing only authorized users to access certain features and content.
The JWT is created at login and stored as a cookie, enabling users to remain logged in for a specified period.
File Uploads with Cloudinary

Users can upload images directly in their blog posts, enhancing the visual appeal of their content.
Multer handles the file upload process, while Cloudinary stores and serves media files securely, saving local storage space.
Dynamic Templating with EJS

EJS templates render dynamic content, enabling custom pages for each blog post and creating a more interactive user experience.
Environment Variables Management

dotenv handles sensitive information, like database URIs and API keys, ensuring they remain secure and hidden from the public codebase.
Development Efficiency with Nodemon

Nodemon restarts the server automatically on code changes, improving development workflow by eliminating manual server restarts.
These features collectively create a functional, secure, and user-friendly blogging platform that offers a seamless experience for both the creators and the readers.
Usage
Start the Server: Follow the Installation steps.
Accessing the App: Visit http://localhost:5000 to view the app locally.
Environment Variables: Configure all necessary environment variables as outlined above.
License
This project is licensed under the ISC License - see the LICENSE file for details.
'''
Author
Developed by Rishabh Singh.
