const { genAI } = require('../config/gemini');
const { db } = require('../config/firebase');
const WARDROBE_COLLECTION = 'wardrobes';

const conversationMemory = {}; // { [uid]: [{ user, ai }, ...] }

const getWardrobeByUid = async (uid) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new Error('Wardrobe not found');
    }

    const itemsObj = doc.data().items || {};
    const wardrobeArray = Object.entries(itemsObj).map(([id, item]) => ({
        id,
        ...item
    }));

    return wardrobeArray;
};

const askStylistLLM = async (uid, question) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const wardrobeArray = await getWardrobeByUid(uid);

    const wardrobeText = wardrobeArray.map(item =>
        `- ${item.name} (${item.type}${item.color ? `, ${item.color}` : ''}${item.tags ? `, Tags: ${item.tags.join(', ')}` : ''})`
    ).join('\n');

    // Get last 3 conversation pairs for this user
    const memory = conversationMemory[uid] || [];
    const memoryText = memory.map(
        pair => `User: ${pair.user}\nAI: ${pair.ai}`
    ).join('\n\n');

    const prompt = `
    You are a virtual stylist. The user owns the following wardrobe:

    ${wardrobeText}

    Recent conversation between the user and the AI stylist:
    ${memoryText ? memoryText + '\n\n' : ''}The user asked: "${question}"

    Please suggest an outfit to the user which will look good, preferring the items in their 
    wardrobe but not limiting the scope to the wardrobe. Mention which items belong to the wardrobe 
    and which do not in the suggested outfit. Also make sure the user gets a topwear, a bottomwear, 
    footwear and accessories in the suggested outfit. Be specific and explain your choices.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiAnswer = response.text();

    // Update memory (keep only last 3 pairs)
    conversationMemory[uid] = [
        ...(memory.length >= 3 ? memory.slice(1) : memory),
        { user: question, ai: aiAnswer }
    ];

    return aiAnswer;
};

module.exports = { getWardrobeByUid, askStylistLLM };
