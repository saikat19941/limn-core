const allowRoles = (...roles) => {

    return (req, res, next) => {

        try {

            // Check User
            if (!req.user) {

                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });

            }


            // Check Role
            if (!roles.includes(req.user.role)) {

                return res.status(403).json({
                    success: false,
                    message: "Permission Denied"
                });

            }


            next();

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: "Role Middleware Error"
            });

        }

    };

};


module.exports = {
    allowRoles
};