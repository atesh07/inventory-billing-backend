const router = require('express').Router();
const ctrl = require('../controllers/reportController');

router.get('/reports/inventory', ctrl.inventory);
router.get('/reports/transactions', ctrl.transactions);

module.exports = router;
