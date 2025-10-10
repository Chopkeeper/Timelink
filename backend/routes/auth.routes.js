const express = require('express');
const { register, login, getUserByLineId, lineRegister } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/line-register', lineRegister);
router.get('/line/:lineUserId', getUserByLineId);

module.exports = router;
