const express = require('express');
const router = express.Router();
const {Register, Verify, Login, ForgetPassword, ResetPassword} = require('../controllers/auth.controller');

router.post('/register',Register);
router.get('/verify',Verify);
router.post('/login',Login);
router.post('/forgetpassword',ForgetPassword);
router.post('/reset-password',ResetPassword);

module.exports = router;