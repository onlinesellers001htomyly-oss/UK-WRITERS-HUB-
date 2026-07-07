import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
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

    // Load all registered users

const usersSnapshot = await getDocs(collection(db, "users"));

const table = document.getElementById("adminUsersTable");

table.innerHTML = "";

let totalUsers = 0;
let activeUsers = 0;

usersSnapshot.forEach((userDoc) => {

    totalUsers++;

    const user = userDoc.data();

    if (user.membership === "Active") {
        activeUsers++;
    }

    table.innerHTML += `
    <tr>

        <td>${user.fullname}</td>

        <td>${user.email}</td>

        <td>${user.phone || "-"}</td>

        <td>${user.referralCode || "-"}</td>

        <td>${user.referredBy || "None"}</td>

        <td>$${Number(user.balance || 0).toFixed(2)}</td>

        <td>$${Number(user.referralEarnings || 0).toFixed(2)}</td>

        <td>${user.membership}</td>

        <td>
            Coming Soon
        </td>

    </tr>
    `;

});

document.getElementById("adminTotalUsers").textContent = totalUsers;

document.getElementById("adminActiveUsers").textContent = activeUsers;
    window.approveMembership = async function(paymentId, userId) {

    if (!confirm("Approve this membership payment?")) {
        return;
    }

    // Update the user's membership
    await updateDoc(doc(db, "users", userId), {
        membership: "Active"
    });

    // Update the payment status
    await updateDoc(doc(db, "payments", paymentId), {
        status: "Approved"
    });

    alert("Membership approved successfully.");

    location.reload();
        }
