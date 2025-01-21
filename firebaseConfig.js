import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDy-RtUg-nv78usT0cDcEhW6wwBl6OW0yU",
  authDomain: "hotel-management-system-14983.firebaseapp.com",
  databaseURL:
    "https://hotel-management-system-14983-default-rtdb.firebaseio.com",
  projectId: "hotel-management-system-14983",
  storageBucket: "hotel-management-system-14983.firebasestorage.app",
  messagingSenderId: "328567495934",
  appId: "1:328567495934:web:586246843d4f1a88da19af",
  measurementId: "G-E5N7ZDHRXG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, onAuthStateChanged };
