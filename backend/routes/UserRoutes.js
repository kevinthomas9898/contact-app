const express = require('express');

const router = express.Router();

const { registerUser, loginUser, currectUserInfo } = require('../controllers/usersController');
const { validateToken } = require('../middleware/validateTokenHandler');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/currect').get(validateToken, currectUserInfo);

module.exports = router; 