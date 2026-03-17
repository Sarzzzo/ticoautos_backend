// this middleware is used to protect routes, so only authenticated users can access them
const jwt = require("jsonwebtoken");
const envExport = require("dotenv").config();

const authenticateToken = async function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    // We verify the token using the secret key. If it's valid, we get the decoded payload back.
    const decoded = jwt.verify(token, JWT_SECRET);

    // info decoded is now available in req.user for the next middleware or route handler
    req.user = decoded.user;

    // the user is authenticated, we can proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { authenticateToken };
