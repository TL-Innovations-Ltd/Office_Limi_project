const jwt = require("jsonwebtoken");
const User_DB  = require('../user/models/user_models');
const authClientmiddleware = async(req, res, next) => {
    const token = req.header("Authorization"); // Token from request headers
    if (!token) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify token
        const user_data = await User_DB.findOne({_id  : decoded.id});
        req.user = user_data; // Store decoded user data in request
        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authClientmiddleware;
