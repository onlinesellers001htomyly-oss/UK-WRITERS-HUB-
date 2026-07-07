import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const ADMIN_EMAIL = "adminukwritershubcompany@gmail.com";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location = "login.html";
        return;
    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {
        window.location = "login.html";
        return;
    }

    const data = snap.data();

    if (data.email !== ADMIN_EMAIL) {

        alert("Access denied. Administrator only.");

        window.location = "dashboard.html";

        return;
    }

    console.log("Administrator logged in successfully.");

});
