import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqRTkZ3gCslH4eStIsLoObIQAn6jrIbEs",
  authDomain: "reactmalaysia-6b2a1.firebaseapp.com",
  projectId: "reactmalaysia-6b2a1",
  storageBucket: "reactmalaysia-6b2a1.appspot.com",
  messagingSenderId: "864760495911",
  appId: "1:864760495911:web:66f65f4ac87b2fe0a3b302",
  measurementId: "G-26FK2151C8",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
