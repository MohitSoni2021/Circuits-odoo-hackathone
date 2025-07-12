import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAtIKj-LJXXlEmLl1At_9gmaYo3xsm7ar0",
  authDomain: "carina-fashion.firebaseapp.com",
  projectId: "carina-fashion",
  storageBucket: "carina-fashion.firebasestorage.app",
  messagingSenderId: "350863497750",
  appId: "1:350863497750:web:88b3dd6059f733ba1a7337",
  measurementId: "G-3G7SS7LVT9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics conditionally
let analytics = null;
isSupported().then(yes => yes ? getAnalytics(app) : null).then(analyticsInstance => {
  analytics = analyticsInstance;
}).catch(err => {
  console.log('Analytics not supported or failed to initialize:', err);
});

export { analytics };

export default app; 