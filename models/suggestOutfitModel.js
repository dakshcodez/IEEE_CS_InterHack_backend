const { genAI } = require('../config/gemini');
const Stylist = require('./stylistModel');

const suggestOutfitLLM = async (uid, occasion) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const wardrobeArray = await Stylist.getWardrobeByUid(uid);

    if (!wardrobeArray.length) {
        throw new Error('Wardrobe is empty');
    }

    const wardrobeText = wardrobeArray.map(item =>
        `- ${item.name} (${item.type}${item.color ? `, ${item.color}` : ''}${item.tags ? `, Tags: ${item.tags.join(', ')}` : ''})`
    ).join('\n');

    const prompt = `
    You are a virtual stylist. The user owns the following wardrobe:

    ${wardrobeText}

    The user has an occasion: "${occasion}"

    Please suggest an outfit that is suitable for this occasion. Unless the user specifically 
    mentions that they want the items only from the wardrobe, suggest the user an outfit considering
    options inside and outside of it, while preferring the items inside. Mention which items belong to the wardrobe 
    and which do not in the suggested outfit. Ensure the user gets a topwear, a bottomwear, 
    footwear and accessories in the suggested outfit. Be specific and explain your choices.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
};

module.exports = { suggestOutfitLLM };