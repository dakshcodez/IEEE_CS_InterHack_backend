const express = require('express');
const router = express.Router();
const suggestOutfitController = require('../controllers/suggestOutfitController');

router.post('/:uid', suggestOutfitController.suggestOutfit);

module.exports = router;