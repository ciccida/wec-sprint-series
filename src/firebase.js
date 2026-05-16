import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZ2wdmk-RdJ-t2EGQXOYrGz-F1mT5wtHc",
  authDomain: "wecss-portal.firebaseapp.com",
  projectId: "wecss-portal",
  storageBucket: "wecss-portal.firebasestorage.app",
  messagingSenderId: "559922975403",
  appId: "1:559922975403:web:b6a7f4254ec615140a5dee",
  measurementId: "G-11DYV2TJP5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
