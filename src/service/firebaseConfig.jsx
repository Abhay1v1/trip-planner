// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAfMXKm4LfXKNF2RNMmoPwmeOETEP0g9rs",
  authDomain: "build-ap-26.firebaseapp.com",
  projectId: "build-ap-26",
  storageBucket: "build-ap-26.firebasestorage.app",
  messagingSenderId: "684379244976",
  appId: "1:684379244976:web:628f45cceb068a949dae75",
  measurementId: "G-Z7RBWPC9MR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
