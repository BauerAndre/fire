// import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_3eCLGsusr4bmkq-fPeHFuqqzsI8lY54",
  authDomain: "curso-66819.firebaseapp.com",
  projectId: "curso-66819",
  storageBucket: "curso-66819.appspot.com",
  messagingSenderId: "628708197926",
  appId: "1:628708197926:web:e05146286e2d5eab2208e7",
  measurementId: "G-8NEY64370V",
};
// if (!firebase.apps.length) {
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
// }
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
// export default firebase;
