const asyncHandler = require("express-async-handler");
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json({
        id: user.id,
        email: user.email,
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({ email })

    //compare passwords with hashed-password
    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            }
        },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        res.status(200).json({ accessToken });
    } else {
        res.status(401);
        throw new Error("Password is not valid")
    }
    res.status(200).json({ message: "Login" });
})

const currectUserInfo = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
})

module.exports = { registerUser, loginUser, currectUserInfo }