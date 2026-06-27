// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Replace with your Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyAdShmmM4ILX3bfV265R399i3Rvy0Qg0rU",

  authDomain: "uk-writers-hub-280de.firebaseapp.com",

  projectId: "uk-writers-hub-280de",

  storageBucket: "YOUR_PROJECT.firebasestorage.app",

  messagingSenderId: "YOUR_SENDER_ID",

  appId: "YOUR_APP_ID"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);

const db = getFirestore(app);

// Export for use in other files
export { auth, db };
