// this middleware is used to protect routes, so only authenticated users can access them
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    // 1. Get the token from the header
    // The standart is the token in the header 'x-auth-token'
    // or in the header 'Authorization' like 'Bearer <token>'
    const token = req.header('x-auth-token') ||
        req.header('Authorization')?.split(' ')[1];// the 1 is because the token is the second element

    // 2. Check if the token exists
    if (!token) {
        return res.status(401).json({
            message:
                "No token, authorization denied"
        });
    }

    // 3. Verify the token
    try {
        const secret = process.env.JWT_SECRET || 'changeme123';
        const decoded = jwt.verify(token, secret);

        // if the token is valid, attach the user payload to req
        req.user = decoded.user;

        // forward the request
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Token is invalid or expired' });
    }
}

