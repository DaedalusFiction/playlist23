import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize database and storage
const db = getFirestore(app);
const storage = getStorage(app);

//initialize OAuth authentication
const provider = new GoogleAuthProvider();
const auth = getAuth();

export { db, storage, provider, auth };
