import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfW2ZSQqnRWewGxgvglnsnNybNvdZIB9U",
  authDomain: "codesus-c6c78.firebaseapp.com",
  projectId: "codesus-c6c78",
  storageBucket: "codesus-c6c78.firebasestorage.app",
  messagingSenderId: "282718240107",
  appId: "1:282718240107:web:2dd695e9924c9b920de02e",
  measurementId: "G-TB7QN1HXCE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
