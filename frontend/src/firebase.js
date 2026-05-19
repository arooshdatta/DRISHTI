import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "drishti-live-129481",
  appId: "1:208821558784:web:0cebb6df0b6804008c82e5",
  storageBucket: "drishti-live-129481.firebasestorage.app",
  apiKey: "AIzaSyAdth04Ax_dzBDc7tB7GxIlJIZvnUOUgOA",
  authDomain: "drishti-live-129481.firebaseapp.com",
  messagingSenderId: "208821558784"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
