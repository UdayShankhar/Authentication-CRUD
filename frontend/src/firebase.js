// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVy9p9-Laf3IQhDTL-D-bOkz0Y-PulfQk",
  authDomain: "authenticationcrud-fce4a.firebaseapp.com",
  projectId: "authenticationcrud-fce4a",
  storageBucket: "authenticationcrud-fce4a.firebasestorage.app",
  messagingSenderId: "579859628838",
  appId: "1:579859628838:web:64b367a6a29fa67c6eb7e7",
  measurementId: "G-KMXSW6JY2D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
