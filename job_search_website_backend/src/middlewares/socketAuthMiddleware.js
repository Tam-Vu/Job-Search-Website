import jwt from 'jsonwebtoken';
require('dotenv').config();

/**
 * Socket.IO authentication middleware that verifies JWT tokens
 * and attaches user information to the socket connection
 */
const socketAuthMiddleware = (socket, next) => {
  try {
    // Get token from handshake auth or query params
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication token is required'));
    }
    
    console.log("Received token for verification:", token ? `${token.substring(0, 10)}...` : 'none');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log("Decoded JWT payload:", JSON.stringify(decoded));
    
    if (!decoded) {
      return next(new Error('Invalid authentication token'));
    }
    
    // Extract user data based on your specific JWT structure
    // Your token has the user data nested in a "payload" field
    const payload = decoded.payload || {};
    
    const userData = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    
    console.log("Extracted user data:", JSON.stringify(userData));
    
    // Attach user info to socket
    socket.user = userData;
    
    // Join a room specific to this user
    if (userData.id) {
      socket.join(`user_${userData.id}`);
      console.log(`User ${userData.id} authenticated and joined room user_${userData.id}`);
      
      // Send authenticated event to client with user data
      socket.emit('connect_authenticated', userData);
    } else {
      console.warn("User ID is undefined, cannot join user-specific room");
    }
    
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    return next(new Error('Authentication failed: ' + error.message));
  }
};

export default socketAuthMiddleware;
