const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const {
    findUserByEmail
} = require("../services/databaseService");


// Login
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate Input
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email And Password Required"
            });

        }


        // Find User
        const user = await findUserByEmail(email);


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email"
            });

        }


        // Compare Password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });

        }


        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login Failed"
        });

    }

};


module.exports = {
    login
};