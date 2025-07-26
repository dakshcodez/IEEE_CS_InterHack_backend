const Wardrobe = require('../models/wardrobeModel');

const getWardrobe = async (req, res) => {
  const uid = req.params.uid;
  const items = await Wardrobe.getWardrobeByUserId(uid);
  res.json({ wardrobe: items });
};

const saveWardrobe = async (req, res) => {
  const uid = req.params.uid;
  const { items } = req.body;
  await Wardrobe.saveWardrobe(uid, items);
  res.json({ message: 'Wardrobe saved successfully' });
};

const addItem = async (req, res) => {
  const uid = req.params.uid;
  const { item } = req.body;
  await Wardrobe.addItemToWardrobe(uid, item);
  res.json({ message: 'Item added successfully' });
};

module.exports = { getWardrobe, saveWardrobe, addItem };
