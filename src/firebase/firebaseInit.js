import firebase from 'firebase/compat/app';
import "firebase/firestore";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";
var firebaseConfig = {
    apiKey: "AIzaSyBd1oEULyZXmXpngoBuaTxF9IXpLdA51AM",
    authDomain: "fas-deli-c89d0.firebaseapp.com",
    projectId: "fas-deli-c89d0",
    storageBucket: "fas-deli-c89d0.appspot.com",
    messagingSenderId: "848881093061",
    appId: "1:848881093061:web:501f6cafd861630c3863ac",
    measurementId: "G-0T8S1JWKMN"
};
// Initialize Firebase
// firebase.analytics();
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db };
export default firebaseApp;