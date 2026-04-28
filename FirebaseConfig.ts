// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKXLgrZBvR6qOMEiaXOBXeoyDbh8zdqXw",
  authDomain: "rnmovieapp-be57c.firebaseapp.com",
  projectId: "rnmovieapp-be57c",
  storageBucket: "rnmovieapp-be57c.firebasestorage.app",
  messagingSenderId: "511118032239",
  appId: "1:511118032239:web:b59a4903a327335fd73c9a"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP );