import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes: verifies JWT bearer token
 */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'agriconnect_sih_super_secure_jwt_secret_key_2026');

      // Fetch user without password
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to token no longer exists.' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid or expired token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization required. Please provide a Bearer token.' });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles Allowed roles ('farmer', 'consumer', 'hub_manager', 'admin')
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role || 'Guest'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};
