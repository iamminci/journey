// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyKmz_gQOkJ3nbBWcxkYY1u25MpRRrxEs",
  authDomain: "journey-d7925.firebaseapp.com",
  projectId: "journey-d7925",
  storageBucket: "journey-d7925.appspot.com",
  messagingSenderId: "503129982060",
  appId: "1:503129982060:web:4cb293a457b4a650730449",
  measurementId: "G-467QLT2HY2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore();
