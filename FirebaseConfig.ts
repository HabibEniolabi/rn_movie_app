// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

if (!firebaseApiKey) {
  throw new Error("Missing EXPO_PUBLIC_FIREBASE_API_KEY");
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: "rnmovieapp-be57c.firebaseapp.com",
  projectId: "rnmovieapp-be57c",
  storageBucket: "rnmovieapp-be57c.firebasestorage.app",
  messagingSenderId: "511118032239",
  appId: "1:511118032239:web:b59a4903a327335fd73c9a"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
} catch(error) {
  auth = getAuth(app)
}

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = auth;
export const FIREBASE_DB = getFirestore(app);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);