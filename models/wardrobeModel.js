const { admin, db }= require('../config/firebase');
//const db = admin.firestore();
const WARDROBE_COLLECTION = 'wardrobes';

const getWardrobeByUserId = async (uid) => {
    const doc = await db.collection(WARDROBE_COLLECTION).doc(uid).get();
    return doc.exists ? doc.data().items : [];
};

const saveWardrobe = async (uid, items) => {
    await db.collection(WARDROBE_COLLECTION).doc(uid).set({ items });
};

const addItemToWardrobe = async (uid, item) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    await docRef.update({
        items: admin.firestore.FieldValue.arrayUnion(item)
    });
};

module.exports = { getWardrobeByUserId, saveWardrobe, addItemToWardrobe };