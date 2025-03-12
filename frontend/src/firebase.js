import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfrH3rnWzdMtJUcT06yLSegnYTQqqkO98",
  authDomain: "ontariohealthmaps.firebaseapp.com",
  projectId: "ontariohealthmaps",
  storageBucket: "ontariohealthmaps.firebasestorage.app",
  messagingSenderId: "300159248",
  appId: "1:300159248:web:c191729878932093129595",
  measurementId: "G-H2CY6TC6DW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, collection, addDoc, createUserWithEmailAndPassword };
