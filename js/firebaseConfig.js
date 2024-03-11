// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, get, set, ref, child } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9wMO9yfnCbCW1QrifKK3vfnFqy97acRw",
  authDomain: "planner-5e061.firebaseapp.com",
  databaseURL: "https://planner-5e061-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "planner-5e061",
  storageBucket: "planner-5e061.appspot.com",
  messagingSenderId: "310052297084",
  appId: "1:310052297084:web:b70f4a2eb3879192dd6cf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth(app);
const dbref = ref(db);

export { app, db, auth, set, get, ref, dbref, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, child };