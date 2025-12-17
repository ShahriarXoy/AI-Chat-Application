// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpGfz4YJmShJpOm-P-Epz9P_R3cfonsvA",
  authDomain: "ai-chat-app-23d85.firebaseapp.com",
  projectId: "ai-chat-app-23d85",
  storageBucket: "ai-chat-app-23d85.firebasestorage.app",
  messagingSenderId: "602475812844",
  appId: "1:602475812844:web:6d3cd7956dc347737092c9",
  measurementId: "G-QHMV71QW0H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export them so LoginPage.jsx can use them
export { auth, googleProvider };
