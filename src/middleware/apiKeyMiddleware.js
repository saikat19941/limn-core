const {
    findApiKey,
    updateApiKeyUsage
} = require("../services/databaseService");


const verifyApiKey = async (
    req,
    res,
    next
) => {

    try {

        // Get API Key
        const apiKey =
            req.headers["x-api-key"];


        // Check API Key
        if (!apiKey) {

            return res.status(401).json({
                success: false,
                message: "API Key Missing"
            });

        }


        // Find API Key
        const keyData =
            await findApiKey(apiKey);


        // Invalid Key
        if (!keyData) {

            return res.status(401).json({
                success: false,
                message: "Invalid API Key"
            });

        }


        // Check Active
        if (!keyData.is_active) {

            return res.status(403).json({
                success: false,
                message: "API Key Disabled"
            });

        }


        // Check Expiry
        if (
            !keyData.never_expire &&
            keyData.expires_at
        ) {

            const now =
                new Date();

            const expiry =
                new Date(keyData.expires_at);


            if (now > expiry) {

                return res.status(403).json({
                    success: false,
                    message: "API Key Expired"
                });

            }

        }


        // Check Usage Limit
        if (
            keyData.hit_limit > 0 &&
            keyData.used_hits >= keyData.hit_limit
        ) {

            return res.status(429).json({
                success: false,
                message: "API Limit Exceeded"
            });

        }


        // Update Usage
        await updateApiKeyUsage(
            keyData.id
        );


        // Attach User
        req.user = {
            role: keyData.role,
            apiKey: keyData.api_key
        };


        next();

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "API Key Middleware Error"
        });

    }

};


module.exports = {
    verifyApiKey
};