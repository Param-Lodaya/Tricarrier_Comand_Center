import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDBBLfE0odF1kpF-J-rKLLwwvIMod7gj50",
  authDomain: "tricarrier-commad-center.firebaseapp.com",
  projectId: "tricarrier-commad-center",
  storageBucket: "tricarrier-commad-center.firebasestorage.app",
  messagingSenderId: "564322306632",
  appId: "1:564322306632:web:e6a9299253d9ec2872667d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { collection, getDocs, doc, setDoc, signInWithEmailAndPassword, signOut, onAuthStateChanged };