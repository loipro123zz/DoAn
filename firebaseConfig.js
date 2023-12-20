// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDQdWDi4hznHKdT3dqCGMKQPPmtRLAnTko",
    authDomain: "thangloi-3bdc9.firebaseapp.com",
    projectId: "thangloi-3bdc9",
    storageBucket: "thangloi-3bdc9.appspot.com",
    messagingSenderId: "360765880975",
    appId: "1:360765880975:web:3df1f682872073baad8efa",
    measurementId: "G-FR4HBJ2LQ6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authentication = getAuth(app);
export const db = getFirestore(app);
