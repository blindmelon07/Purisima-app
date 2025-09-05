import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAiEpiWn8uywzQajno_E-CMQ998FpxhsM",
  authDomain: "purisima-app.firebaseapp.com",
  projectId: "purisima-app",
  storageBucket: "purisima-app.appspot.com",
  messagingSenderId: "157416015809",
  appId: "1:157416015809:web:aa866d4aa73de5c7665140",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
