// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGgFXwab9fMEXkm9RgAXmpcnDAokVN-fc",
  authDomain: "weeding-zone.firebaseapp.com",
  projectId: "weeding-zone",
  storageBucket: "weeding-zone.firebasestorage.app",
  messagingSenderId: "344684503260",
  appId: "1:344684503260:web:6a7c4ee7536cd3f12a5419"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
