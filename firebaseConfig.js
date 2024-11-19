import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcK5q90hHCTbE0bt05mweF06RvEnu9wLk",
  authDomain: "smart-yoga-mat-34948.firebaseapp.com",
  projectId: "smart-yoga-mat-34948",
  storageBucket: "smart-yoga-mat-34948.firebasestorage.app",
  messagingSenderId: "507901373433",
  appId: "1:507901373433:web:f84a7179aa981e3fa4ab28",
  measurementId: "G-CJD6CBDMZG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
