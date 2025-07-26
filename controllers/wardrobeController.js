const Wardrobe = require('../models/wardrobeModel');

const getWardrobe = async (req, res) => {
  const uid = req.params.uid;
  const items = await Wardrobe.getWardrobeByUserId(uid);
  res.json({ wardrobe: items });
};

const saveWardrobe = async (req, res) => {
  const uid = req.params.uid;
  const itemsMap = req.body.items;
  await Wardrobe.saveWardrobe(uid, itemsMap);
  res.json({ message: 'Wardrobe saved successfully' });
};

const addItem = async (req, res) => {
  const uid = req.params.uid;
  const { itemId, item } = req.body;
  await Wardrobe.addItemToWardrobe(uid, itemId, item);
  res.json({ message: 'Item added successfully' });
};

const removeItem = async (req, res) => {
  const uid = req.params.uid;
  const { itemId } = req.body;

  try {
    if (!itemId) {
      return res.status(400).json({ error: 'itemId is required in the request body' });
    }

    await Wardrobe.removeItemFromWardrobe(uid, itemId);
    res.status(200).json({ message: 'Item removed successfully' });

  } catch (error) {
    console.error(`Failed to remove item: ${error.message}`);

    res.status(error.statusCode || 500).json({
      error: error.message || 'An unexpected error occurred while removing the item',
    });
  }
};


const updateItem = async (req, res) => {
  const uid = req.params.uid;
  const { itemId, updatedItem } = req.body;

  try {
    await Wardrobe.updateItemInWardrobe(uid, itemId, updatedItem);
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getWardrobe, saveWardrobe, addItem, removeItem, updateItem };
