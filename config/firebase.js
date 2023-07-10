// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// firestore
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvja8tyk_wyp7nwauLl0VXGfTI_2bkYQA",
  authDomain: "neighborly-5eb09.firebaseapp.com",
  projectId: "neighborly-5eb09",
  storageBucket: "neighborly-5eb09.appspot.com",
  messagingSenderId: "490077003595",
  appId: "1:490077003595:web:704df59ae487ab736112ce",
  measurementId: "G-RBQTYH13NX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { app, firebaseConfig, analytics, storage };
