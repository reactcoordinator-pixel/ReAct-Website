// "use server";

import {
  addDoc,
  collection,
  doc,
  getFirestore,
  deleteDoc,
  updateDoc as firestoreUpdateDoc,
} from "firebase/firestore";
import { app } from "../FirebaseConfig";

const db = getFirestore(app);

// No longer need Firebase Storage imports
// import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// const storage = getStorage(app);

async function postDoc(data, collectionName) {
  try {
    const collectionRef = collection(db, collectionName);

    // Create the document with the original data (imageUrl is now the direct URL from your custom domain)
    const docRef = await addDoc(collectionRef, {
      ...data,
      // Ensure imageUrl can be null/undefined if no image
      imageUrl: data.imageUrl || null,
    });

    // Add the Firestore document ID to the document itself (common pattern)
    await firestoreUpdateDoc(docRef, {
      id: docRef.id,
    });

    console.log(`Posted Successfully`);
    return true;
  } catch (error) {
    console.error("Error posting document:", error);
    return false;
  }
}

async function updateDoc(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await firestoreUpdateDoc(docRef, {
      ...data,
      // Preserve null if no image
      imageUrl: data.imageUrl || null,
    });
    console.log(`Updated Successfully`);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    return false;
  }
}

async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
  }
}

// Removed storeImageInFirestore entirely – we no longer fetch/re-upload images to Firebase Storage
// The imageUrl coming from the client is now the direct URL from https://www.uploads.reactmalaysia.org

export { updateDoc, postDoc, deleteDocument };
