import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC-tJ5nxUVJ-1_3D4UDrTD8Dx-BfWcwq8",
  authDomain: "women-in-health.firebaseapp.com",
  projectId: "women-in-health",
  storageBucket: "women-in-health.firebasestorage.app",
  messagingSenderId: "856599500242",
  appId: "1:856599500242:web:4dc3b1e55c4e803daea40b",
  measurementId: "G-F97KBHM1DY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

// Export the app instance
export default app;