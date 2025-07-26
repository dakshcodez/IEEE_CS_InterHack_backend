const Stylist = require('../models/stylistModel');

const askStylist = async (req, res) => {
    const uid = req.params.uid;
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    try {
        const answer = await Stylist.askStylistLLM(uid, question);
        res.status(200).json({ reply: answer });
    } catch (error) {
        console.error('Stylist error:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

module.exports = { askStylist };