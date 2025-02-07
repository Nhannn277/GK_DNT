import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGgyTivSPRGqGyTKom_cras_W6cMaRT0U",
  authDomain: "giuaky-dnt.firebaseapp.com",
  projectId: "giuaky-dnt",
  storageBucket: "giuaky-dnt.firebasestorage.app",
  messagingSenderId: "293220744348",
  appId: "1:293220744348:android:6200a2ac2fdd131b954159",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth, collection, getDocs, addDoc, deleteDoc, doc };
