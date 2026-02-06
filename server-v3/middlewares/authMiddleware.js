const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

const checkAuth = async (req, res, next) => {
    const token = req.cookies.jwt; // Get the JWT from cookies
    console.log("auth status checking attempt");
    console.log(`req.cookies: ${JSON.stringify(req.cookies)}`);

    if (!token) {
        console.log("There was no token");
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = await Admin.findById(decoded.id); // Attach user info(_id) to the request
        console.log("User found:" + JSON.stringify(req.user));
        
        next(); // Proceed to the next middleware or route
    } catch (err) {
        console.log("Error in status check middleware: " + err.message);
        next(err)
    }
};

module.exports = checkAuth