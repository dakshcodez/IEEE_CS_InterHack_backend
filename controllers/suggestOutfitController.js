const SuggestOutfit = require('../models/suggestOutfitModel');

const suggestOutfit = async (req, res) => {
    const uid = req.params.uid;
    const { occasion } = req.body;

    if (!occasion) {
        return res.status(400).json({ error: 'Occasion is required' });
    }

    try {
        const outfitSuggestion = await SuggestOutfit.suggestOutfitLLM(uid, occasion);
        res.status(200).json({ suggestion: outfitSuggestion });
    } catch (error) {
        console.error('Suggest Outfit error:', error.message);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

module.exports = { suggestOutfit };