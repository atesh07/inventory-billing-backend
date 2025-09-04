const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.get('/products', ctrl.list);
router.post('/products', ctrl.create);
router.put('/products/:id', ctrl.update);
router.delete('/products/:id', ctrl.remove);

module.exports = router;
