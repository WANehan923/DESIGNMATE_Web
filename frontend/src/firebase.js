import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGUj6wo7I6UDL2Q0EtWyzBGmJtV9rsYyo",
  authDomain: "furniture-web-6dea7.firebaseapp.com",
  projectId: "furniture-web-6dea7",
  storageBucket: "furniture-web-6dea7.firebasestorage.app",
  messagingSenderId: "683053891340",
  appId: "1:683053891340:web:b06f1d1c00986e730fd329"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and firestore
export const auth = getAuth(app);
export const db = getFirestore(app);