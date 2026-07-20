import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";


const storage = getStorage(app);


export { auth, db, storage };
// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Replace with your Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyAdShmmM4ILX3bfV265R399i3Rvy0Qg0rU",

  authDomain: "uk-writers-hub-280de.firebaseapp.com",

  projectId: "uk-writers-hub-280de",

  storageBucket: "uk-writers-hub-280de.firebasestorage.app",

  messagingSenderId: "176212772553",

  appId: "1:176212772553:web:9f26775b4e77dddc7daf18"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);

const db = getFirestore(app);

// Export for use in other files
export { auth, db };
