// Firebase configuration
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDEhY7_TneNm5aaIZqIosoqnx2JoqzHIvE",
  authDomain: "afterwish-6c49d.firebaseapp.com",
  projectId: "afterwish-6c49d",
  storageBucket: "afterwish-6c49d.firebasestorage.app",
  messagingSenderId: "966631453031",
  appId: "1:966631453031:web:d2d9e37242e9b67db07fc2"
};

// Initialize Firebase (only if not already initialized)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;