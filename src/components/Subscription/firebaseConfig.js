// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmdz-8CE4y6ZKCJn9BZmPtAEYyw9hlJok",
  authDomain: "presidio-challenge.firebaseapp.com",
  projectId: "presidio-challenge",
  storageBucket: "presidio-challenge.firebasestorage.app",
  messagingSenderId: "707836565782",
  appId: "1:707836565782:web:f1a7d79e669e43a3879837",
  measurementId: "G-GY1L4RXD7H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export { db };
