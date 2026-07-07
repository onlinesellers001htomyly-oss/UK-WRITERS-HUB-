import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const phoneInput = document.getElementById("phone");
const payBtn = document.getElementById("payBtn");
const paymentMessage = document.getElementById("paymentMessage");
const membershipStatus = document.getElementById("membershipStatus");

let currentUser = null;
let currentUserData = null;

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location = "login.html";
        return;
    }

    currentUser = user;

    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {

        currentUserData = snap.data();

        membershipStatus.innerText =
            currentUserData.membership || "Pending";
    }

});

payBtn.addEventListener("click", async () => {

    const phone = phoneInput.value.trim();

    if (phone === "") {

        paymentMessage.innerHTML =
            "<span class='error'>Please enter your phone number.</span>";

        return;
    }

    paymentMessage.innerHTML =
        "⏳ Processing payment request...";

    try {

        await addDoc(collection(db, "payments"), {

            userId: currentUser.uid,

            fullname: currentUserData.fullname,

            email: currentUserData.email,

            phone: phone,

            amount: 10,

            currency: "USD",

            tillNumber: "6892947",

            paymentMethod: "M-PESA",

            status: "Pending",

            createdAt: serverTimestamp()

        });

        paymentMessage.innerHTML =
            "<span class='success'>✅ Payment request submitted successfully. Please complete your M-PESA payment. Your account will be activated after payment confirmation.</span>";

    } catch (error) {

        console.error(error);

        paymentMessage.innerHTML =
            "<span class='error'>❌ Failed to submit payment request. Please try again.</span>";

    }

});
