// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPJLKTxiVlIeoUNIMroUSnfdqWLtQOtuQ",
  authDomain: "gardino-plant-care.firebaseapp.com",
  projectId: "gardino-plant-care",
  storageBucket: "gardino-plant-care.firebasestorage.app",
  messagingSenderId: "459100311714",
  appId: "1:459100311714:web:be2aef5c19311c0e4107fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Intialize authentication with persistence
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),

})