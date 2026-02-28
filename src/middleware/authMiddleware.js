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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // if the token is valid, we add the user to the request(id and role)
        // in the petition (req.user)
        //in this way, the controller can access the user id and role, and who is the user
        req.user = decoded.user;

        // all in order, lets go to the next middleware or controller
        next(); // right here
        //====================================================================================

    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({
            message:
                "Internal server error"
        });
    }
}

