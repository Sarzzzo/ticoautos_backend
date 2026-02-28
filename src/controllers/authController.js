const User = require("../models/user");

// the encryption library
const bycryptjs = require("bcryptjs");

// the json web token library, or the 'jwt' library
const jwt = require("jsonwebtoken");

// ====================================================================================
// BUSINESS LOGIC TO REGISTER A NEW USER
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                message:
                    "User already exists"
            });
        }

        // 2. Hash the password, the 10 is the "salt", or the number of times the password is 
        // hashed
        const salt = await bycryptjs.hash(password, 10);
        const passwordHash = await bycryptjs.hash(password, salt);

        // 3. Create the user
        const newUser = new User({
            username,
            email,
            passwordHash,
            role: role || "buyer" // if role is not defined, it will be "buyer"
        });

        // 4. And.. Save the user
        await newUser.save();

        // Results, if everything goes well
        return res.status(201).json({
            message:
                "User created successfully"
        });

    } catch (error) {
        // Results, if something goes wrong
        console.error("Error creating user:", error);
        return res.status(500).json({
            message:
                "Internal server error"
        });
    }
};

// ====================================================================================
// BUSINESS LOGIC TO LOGIN A USER
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if the user exists, by his username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message:
                    "Credentials not valid"
            });
        }
        // 2. Check if the password is encrypted in DB
        const isMatch = await bycryptjs.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({
                message:
                    "Credentials not valid"
            });
        }
        // 3. Generate a token, if everything goes well
        const payload = {
            user: {
                id: user._id,
                role: user.role
                // only with 2 attributes, the id and the role
            }
        };

        // sign the token, with the secret key and the expiration time
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" },
            // before that 10h is the expiration time, and the secret key is the process.env.JWT_SECRET
            // the payload is the user id and role

            // so..
            (err, token) => {
                if (err) throw err;
                // let's send the token to the client, in the frontend
                res.json({ token, role: user.role });
            }
        );
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({
            message:
                "Internal server error"
        });
    }
};


