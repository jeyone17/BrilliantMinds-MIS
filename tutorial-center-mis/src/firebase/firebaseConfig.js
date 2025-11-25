// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHLepnTnM8ND7gx5F008UoRl_82vrXAVE",
  authDomain: "brilliantminds-mis.firebaseapp.com",
  projectId: "brilliantminds-mis",
  storageBucket: "brilliantminds-mis.firebasestorage.app",
  messagingSenderId: "668995606202",
  appId: "1:668995606202:web:30f61d6b2faab8222f5483",
  measurementId: "G-NZSNLDWH5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);