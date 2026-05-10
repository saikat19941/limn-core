const {
    verifyToken
} = require("./authMiddleware");

const {
    verifyApiKey
} = require("./apiKeyMiddleware");


// Smart Access Middleware
const allowAccess = async (
    req,
    res,
    next
) => {

    try {

        // JWT Exists?
        const authHeader =
            req.headers.authorization;


        // API Key Exists?
        const apiKey =
            req.headers["x-api-key"];


        // PRIORITY 1 → JWT
        if (authHeader) {

            return verifyToken(
                req,
                res,
                next
            );

        }


        // PRIORITY 2 → API KEY
        if (apiKey) {

            return verifyApiKey(
                req,
                res,
                next
            );

        }


        // No Auth
        return res.status(401).json({
            success: false,
            message: "Access Denied"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Access Middleware Error"
        });

    }

};


module.exports = {
    allowAccess
};