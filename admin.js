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

const ADMIN_EMAIL = "muindithomas16@gmail.com";

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location = "login.html";
        return;

    }

    const snap = await getDoc(doc(db, "users", user.uid));

    if (!snap.exists()) {

        alert("User profile not found.");

        window.location = "login.html";

        return;

    }

    const data = snap.data();

    if (data.email !== ADMIN_EMAIL) {

        alert("Access denied.");

        window.location = "dashboard.html";

        return;

    }

    console.log("Admin verified successfully.");
await loadUsers();
});
async function loadUsers() {

    const usersTable = document.getElementById("adminUsersTable");

    usersTable.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "users"));

    let totalUsers = 0;
    let activeUsers = 0;

    querySnapshot.forEach((docSnap) => {

        totalUsers++;

        const user = docSnap.data();

        if (user.membership === "Active") {
            activeUsers++;
        }

        usersTable.innerHTML += `
        <tr>

            <td>${user.fullname}</td>

            <td>${user.email}</td>

            <td>${user.phone}</td>

            <td>${user.referralCode}</td>

            <td>${user.referredBy || "None"}</td>

            <td>$${Number(user.balance || 0).toFixed(2)}</td>

            <td>$${Number(user.referralEarnings || 0).toFixed(2)}</td>

            <td>${user.membership}</td>

            <td>
                <button onclick="activateUser('${docSnap.id}')">
                    Activate
                </button>
            </td>

        </tr>
        `;

    });

    document.getElementById("adminTotalUsers").innerText = totalUsers;

    document.getElementById("adminActiveUsers").innerText = activeUsers;

    document.getElementById("adminPendingWithdrawals").innerText = "0";

}
