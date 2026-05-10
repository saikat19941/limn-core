const jwt = require("jsonwebtoken");


// Verify JWT Token
const verifyToken = (req, res, next) => {

    try {

        // Get Header
        const authHeader =
            req.headers.authorization;


        // Check Header
        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message: "Access Denied"
            });

        }


        // Extract Token
        const token =
            authHeader.split(" ")[1];


        // Verify Token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Attach User
        req.user = decoded;


        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};


module.exports = {
    verifyToken
};