import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz20uusSrRrqlrFbYDTsvVeA-L3xNXC5s",
  authDomain: "chamados-7fc8d.firebaseapp.com",
  projectId: "chamados-7fc8d",
  storageBucket: "chamados-7fc8d.appspot.com",
  messagingSenderId: "645635219004",
  appId: "1:645635219004:web:6160afae53e051b1162d39"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export {auth, db, storage};