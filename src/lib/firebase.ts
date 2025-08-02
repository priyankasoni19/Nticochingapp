import { initializeApp, getApp, getApps } from 'firebase/app';

const firebaseConfig = {
  projectId: "fileflex-ksf4j",
  appId: "1:694852250168:web:e34030d708fd1c7eef94cd",
  storageBucket: "fileflex-ksf4j.firebasestorage.app",
  apiKey: "AIzaSyB2MdtiOPgZhs-aEEmjUvNkBzosZDtPo3c",
  authDomain: "fileflex-ksf4j.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "694852250168"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
