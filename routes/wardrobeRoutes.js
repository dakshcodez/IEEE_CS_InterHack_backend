const express = require("express");
const router = express.Router();
const wardrobeController = require("../controllers/wardrobeController");

router.get("/:uid", wardrobeController.getWardrobe);
router.post("/:uid/save", wardrobeController.saveWardrobe);
router.post("/:uid/add", wardrobeController.addItem);

module.exports = router;