import { getUser } from "../routes/user.js"; // Update the path as needed

function checkForAuth(cookieName) {
  return (req, res, next) => {  // Fixed function body
    const tokenValue = req.cookies[cookieName];
    if (!tokenValue) {
      return next();
    }
    try {
      const userPayload = getUser(tokenValue); // Decodes the JWT and gets user payload
      req.user = userPayload; // Attaching the user to the request object
    } catch (error) {
      console.error("Error decoding token:", error); // Log the error for debugging
    }
    return next(); // Proceed to the next middleware
  };
}

export { checkForAuth };



