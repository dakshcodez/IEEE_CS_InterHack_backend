const express = require('express');
const router = express.Router();
const stylistController = require('../controllers/stylistController');

router.post('/:uid', stylistController.askStylist);

module.exports = router;