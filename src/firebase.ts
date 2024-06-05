// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "share-424414.firebaseapp.com",
  projectId: "share-424414",
  storageBucket: "share-424414.appspot.com",
  messagingSenderId: "604311090947",
  appId: "1:604311090947:web:5fcb65b609ef95240bdb36",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
