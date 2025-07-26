const { admin, db }= require('../config/firebase');
const WARDROBE_COLLECTION = 'wardrobes';

const getWardrobeByUserId = async (uid) => {
    const doc = await db.collection(WARDROBE_COLLECTION).doc(uid).get();
    const data = doc.data();
    return data?.items || {};
};

const saveWardrobe = async (uid, items) => {
    await db.collection(WARDROBE_COLLECTION).doc(uid).set({ items });
};

// To test on postman
// {
//     "items" : {
//         "item-id-1" : {"name" : "Red Shirt", "type" : "topwear", "category" : "casual"}
//     }
// }

const addItemToWardrobe = async (uid, itemId, item) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const docSnapshot = await docRef.get();

    // If document doesn't exist, create it with the new item
    if (!docSnapshot.exists) {
        await docRef.set({
            items: {
                [itemId]: item
            }
        });
    } else {
        // If document exists, safely add item to the existing map
        await docRef.update({
            [`items.${itemId}`]: item
        });
    }
};


// To test on postman
// {
//     "itemId" : "item-id-2",
//     "item" : {
//         "name" : "Leather Jacket", "type" : "topwear", "category": "outdoor"
//     }
// }

const removeItemFromWardrobe = async (uid, itemId) => {
  const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
  await docRef.update({
    [`items.${itemId}`]: admin.firestore.FieldValue.delete()
  });
};

// To test on postman
// {
//     "itemId" : "item-id-1"
// }

module.exports = { getWardrobeByUserId, saveWardrobe, addItemToWardrobe, removeItemFromWardrobe };