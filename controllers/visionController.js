const multer = require('multer');
const { analyzeImageBufferWithPrompt } = require('../models/visionModel');

const upload = multer({ storage: multer.memoryStorage() });

const askStylistWithImage = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !req.file)
        return res.status(400).json({ error: 'Missing question or image file' });

    const imageBuffer = req.file.buffer; 

    const response = await analyzeImageBufferWithPrompt(imageBuffer, question);

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error processing image:', error.message);
    res.status(500).json({ error: 'Failed to process image and question' });
  }
};

module.exports = { askStylistWithImage, upload };
