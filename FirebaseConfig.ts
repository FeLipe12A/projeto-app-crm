// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjpUDj8HrcajmoH02HPZUK-bvc3EvJqDg",
  authDomain: "projeto-app-crm.firebaseapp.com",
  projectId: "projeto-app-crm",
  storageBucket: "projeto-app-crm.firebasestorage.app",
  messagingSenderId: "1039806310738",
  appId: "1:1039806310738:web:a8923f0bff55de54c7328b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

