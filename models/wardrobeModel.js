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
//     "itemId" : "item-id-1",
//     "item" : {
//         "name" : "Leather Jacket", "type" : "topwear", "category": "outdoor"
//     }
// }

const removeItemFromWardrobe = async (uid, itemId) => {
  try {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Wardrobe for user ${uid} does not exist`);
    }

    const items = doc.data().items || {};
    if (!items[itemId]) {
      throw new Error(`Item with ID "${itemId}" does not exist in wardrobe`);
    }

    await docRef.update({
      [`items.${itemId}`]: admin.firestore.FieldValue.delete()
    });
  } catch (error) {
    console.error(`Error removing item: ${error.message}`);
    throw error; // Re-throw so controller can respond with an error
  }
};


// To test on postman
// provide itemId in the route parameter
// DELETE /wardrobe/:uid/removeItem/:itemId

const updateItemInWardrobe = async (uid, itemId, updatedItem) => {
    const docRef = db.collection(WARDROBE_COLLECTION).doc(uid);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
        throw new Error("Wardrobe does not exist for this user.");
    }

    const data = docSnapshot.data();
    if (!data.items || !data.items[itemId]) {
        throw new Error("Item does not exist in wardrobe.");
    }

    await docRef.update({
        [`items.${itemId}`]: updatedItem
    });
};

// To test on postman
// {
//   "name": "Green Hoodie (Updated)",
//   "type": "topwear",
//   "category": "partywear"
// }

module.exports = { getWardrobeByUserId, saveWardrobe, addItemToWardrobe, removeItemFromWardrobe, updateItemInWardrobe };