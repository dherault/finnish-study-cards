import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvnMdzmz4ABB-0L21fiROuZfFc2WqYx40",
  authDomain: "finnish-study-cards.firebaseapp.com",
  projectId: "finnish-study-cards",
  storageBucket: "finnish-study-cards.firebasestorage.app",
  messagingSenderId: "447994589125",
  appId: "1:447994589125:web:c6cf91f2ca86204e6c25ac",
  measurementId: "G-6469XE0RPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
