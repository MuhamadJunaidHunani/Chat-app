import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB6Zy4ppT5_rXlxVSD3fFnPXM0kRiN0Ow",
  authDomain: "chiitchaat.firebaseapp.com",
  projectId: "chiitchaat",
  storageBucket: "chiitchaat.appspot.com",
  messagingSenderId: "829961400364",
  appId: "1:829961400364:web:e1b20274652edc73986189",
  measurementId: "G-7FTREVHQWR",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
