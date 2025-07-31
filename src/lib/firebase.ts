
// This file is no longer needed for image storage.
// It is kept for potential future use with other Firebase services.

// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";

// NOTE: The firebaseConfig will be populated automatically by the system.
// You do not need to edit this file.
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "G-..."
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export { app };
