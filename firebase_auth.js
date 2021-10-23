// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKInXo-F-3ZAZtAJHW_tblAFv5KwazCEk",
  authDomain: "fir-auth-40bfa.firebaseapp.com",
  projectId: "fir-auth-40bfa",
  storageBucket: "fir-auth-40bfa.appspot.com",
  messagingSenderId: "945932657694",
  appId: "1:945932657694:web:b384bfba844012f130fa0f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//Initialize authentication and the database
const db = firebase.firestore()
const auth = firebase.auth();
const storage = firebase.storage();

export { auth, db, storage };