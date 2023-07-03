// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
