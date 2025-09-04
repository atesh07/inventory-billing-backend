const router = require('express').Router();
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);

module.exports = router;
