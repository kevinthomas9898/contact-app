const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints (5 attempts per 15 minutes)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: "Too many login/register attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

const { registerUser, loginUser, currentUserInfo } = require('../controllers/usersController');
const { validateToken } = require('../middleware/validateTokenHandler');

router.route('/register').post(authLimiter, registerUser);
router.route('/login').post(authLimiter, loginUser);
router.route('/current').get(validateToken, currentUserInfo);

module.exports = router;