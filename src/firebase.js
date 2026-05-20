import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

// Check if Firebase env variables exist
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasKeys = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId
);

let app;
let auth;
let googleProvider;
let githubProvider;
let isFirebaseMock = true;

if (hasKeys) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();
    isFirebaseMock = false;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { 
  auth, 
  googleProvider, 
  githubProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  isFirebaseMock 
};
