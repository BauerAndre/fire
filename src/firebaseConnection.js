import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_3eCLGsusr4bmkq-fPeHFuqqzsI8lY54",
  authDomain: "curso-66819.firebaseapp.com",
  projectId: "curso-66819",
  storageBucket: "curso-66819.appspot.com",
  messagingSenderId: "628708197926",
  appId: "1:628708197926:web:e05146286e2d5eab2208e7",
  measurementId: "G-8NEY64370V",
};
if (!firebase.apps.length) {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
