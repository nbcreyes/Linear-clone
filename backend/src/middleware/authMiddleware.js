import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract the token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export default protect;