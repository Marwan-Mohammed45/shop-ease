// ✅ الكود صحيح ولكن يمكن تحسينه:
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD7R7c9Kl5APaLV-xvP4XR0JPHk8Yw9S3Q",
  authDomain: "e-commers-app-918db.firebaseapp.com",
  projectId: "e-commers-app-918db",
  storageBucket: "e-commers-app-918db.appspot.com",
  messagingSenderId: "311618977470",
  appId: "1:311618977470:web:3d009fa101be3f0bafe8ef",
  measurementId: "G-TFSX91WR1V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// إنشاء Providers لتسجيل الدخول
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, googleProvider, facebookProvider };