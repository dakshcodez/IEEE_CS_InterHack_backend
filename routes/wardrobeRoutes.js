const express = require("express");
const router = express.Router();
const wardrobeController = require("../controllers/wardrobeController");

router.get("/:uid", wardrobeController.getWardrobe);
router.post("/:uid/save", wardrobeController.saveWardrobe);
router.post("/:uid/add", wardrobeController.addItem);
router.delete("/:uid/removeItem/:itemId", wardrobeController.removeItem);
router.put("/:uid/updateItem/:itemId", wardrobeController.updateItem);


module.exports = router;