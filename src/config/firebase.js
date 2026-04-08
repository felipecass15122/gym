import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';  
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCwSJCH5F6-eUXGjXpYcKU4WJgiCXNiDg",
  authDomain: "gymgain-874ec.firebaseapp.com",
  projectId: "gymgain-874ec",
  storageBucket: "gymgain-874ec.firebasestorage.app",
  messagingSenderId: "583851431783",
  appId: "1:583851431783:web:79fd11ab4bfa932e1d41c2"
};

let app;
let auth;

try {
  // O modo Compat verifica sozinho se o app existe
  if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
    initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
    console.log("🔥 Firebase (Compat) Inicializado.");
  } else {
    app = firebase.app();
    console.log("♻️ Firebase (Compat) Recuperado.");
  }

  auth = firebase.auth();
  
  
  

} catch (error) {
  console.error("❌ Erro Firebase Compat:", error);
  auth = firebase.auth();
}

const db = firebase.firestore();

export { auth, db };