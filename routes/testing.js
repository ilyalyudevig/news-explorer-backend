const router = require('express').Router();
const { reset } = require('../controllers/testing');

router.post('/reset-user', reset);

module.exports = router;
