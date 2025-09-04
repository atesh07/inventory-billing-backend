const router = require('express').Router();
const ctrl = require('../controllers/transactionController');

router.get('/transactions', ctrl.list);
router.post('/transactions', ctrl.create);

module.exports = router;
