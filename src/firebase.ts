// firebase.ts - Configuración completa y corregida
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Config provided by the user (hardcoded as requested)
const firebaseConfig = {
  apiKey: "AIzaSyBtcmAYEoxShrHQ9trXlf9Xr4-0tPR7cV0",
  authDomain: "claudia-estilista.firebaseapp.com",
  projectId: "claudia-estilista",
  storageBucket: "claudia-estilista.firebasestorage.app",
  messagingSenderId: "1064487418488",
  appId: "1:1064487418488:web:0ecb9793415dba46ce0b8d",
  measurementId: "G-TL550EF243",
};

// Initialize Firebase only once. If an app already exists, reuse it.
let app: any;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const db = getFirestore(app);

// Analytics is optional and only available in browser environments
let analytics = null;
try {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} catch (e) {
  // ignore analytics errors (non-fatal)
}

export { analytics };
export default app;
