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
    await Wardrobe.removeItemFromWardrobe(uid, itemId);
    res.json({ message: 'Item removed successfully' });
}

module.exports = { getWardrobe, saveWardrobe, addItem, removeItem };
