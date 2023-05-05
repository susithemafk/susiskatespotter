// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  
import { getStorage } from "firebase/storage"; 
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEzJ_cstxwjRHVxa_khFbSiu1AJp0wKUA",
  authDomain: "susitheskate-7b1e4.firebaseapp.com",
  projectId: "susitheskate-7b1e4",
  storageBucket: "susitheskate-7b1e4.appspot.com",
  messagingSenderId: "857752042154",
  appId: "1:857752042154:web:b0e75fa8a99f73a6e82ed3"
} 

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app) 
export const storage = getStorage(app)
export const auth = getAuth(app)