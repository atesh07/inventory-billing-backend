const router = require('express').Router();
const ctrl = require('../controllers/contactController');

router.get('/contacts', ctrl.list);
router.post('/contacts', ctrl.create);
router.put('/contacts/:id', ctrl.update);
router.delete('/contacts/:id', ctrl.remove);

module.exports = router;
