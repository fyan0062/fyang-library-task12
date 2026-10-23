import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBz7bzRK-RIuVODlHzVHGJbu2UPoLOakTY",
  authDomain: "fit5032-ccce7.firebaseapp.com",
  projectId: "fit5032-ccce7",
  storageBucket: "fit5032-ccce7.firebasestorage.app",
  messagingSenderId: "737463082218",
  appId: "1:737463082218:web:635454706ba5198b2b8b93",
  measurementId: "G-S1BW5HL2TY"
};

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)