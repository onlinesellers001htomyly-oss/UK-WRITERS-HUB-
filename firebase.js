import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAdShmmM4ILX3bfV265R399i3Rvy0Qg0rU",
  authDomain: "uk-writers-hub-280de.firebaseapp.com",
  projectId: "uk-writers-hub-280de",
  storageBucket: "uk-writers-hub-280de.firebasestorage.app",
  messagingSenderId: "176212772553",
  appId: "1:176212772553:web:9f26775b4e77dddc7daf18"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

export { app, auth, db, storage };
