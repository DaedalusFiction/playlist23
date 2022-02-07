// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBvVQIg-TzSo3hdxaxgozf2t070xB_TXhE",
    authDomain: "playlist23-ba075.firebaseapp.com",
    projectId: "playlist23-ba075",
    storageBucket: "playlist23-ba075.appspot.com",
    messagingSenderId: "44992394161",
    appId: "1:44992394161:web:77cf34fc5df9cd1e9f0390",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export { db, storage, provider, auth };
