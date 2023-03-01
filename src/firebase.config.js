
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyGHgsOKDkv4Vto5HGdEbjpcIZr-fMke8",
  authDomain: "house-marketplace-app-2023cgh.firebaseapp.com",
  projectId: "house-marketplace-app-2023cgh",
  storageBucket: "house-marketplace-app-2023cgh.appspot.com",
  messagingSenderId: "521194931022",
  appId: "1:521194931022:web:0373336e1132e83812141f",
  measurementId: "G-Z1B5V2ZSHL"
};

// Initialize Firebase
// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()