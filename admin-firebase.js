import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc,
getDocs,
collection,
updateDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

    if (data.role !== "admin") {
    alert("Access denied.");

    window.location = "dashboard.html";

    return;
    }

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
    <button onclick="approveUser('${userDoc.id}')">
        Approve
    </button>
</td>

    </tr>
    `;

});

document.getElementById("adminTotalUsers").textContent = totalUsers;
// Load payment requests
const paymentsSnapshot = await getDocs(collection(db, "payments"));

const paymentsTable = document.getElementById("paymentsTable");

paymentsTable.innerHTML = "";

paymentsSnapshot.forEach((paymentDoc) => {

    const payment = paymentDoc.data();

    paymentsTable.innerHTML += `
    <tr>
        <td>${payment.fullname || "-"}</td>
        <td>${payment.email || "-"}</td>
        <td>${payment.phone}</td>
        <td>$${payment.amount} ${payment.currency || "USD"}</td>
        <td>${payment.status}</td>
        <td>
            <button onclick="approveMembership('${paymentDoc.id}','${payment.userId}')">
                Approve
            </button>
        </td>
    </tr>
    `;
});
document.getElementById("adminActiveUsers").textContent = activeUsers;
    window.approveMembership = async function(paymentId, userId) {

    if (!confirm("Approve this membership payment?")) {
        return;
    }
// Load withdrawal requests

const withdrawalsSnapshot =
await getDocs(collection(db,"withdrawals"));

const withdrawalsTable =
document.getElementById("adminWithdrawalsTable");

withdrawalsTable.innerHTML = "";

withdrawalsSnapshot.forEach((withdrawDoc)=>{

    const withdraw = withdrawDoc.data();

    withdrawalsTable.innerHTML += `

    <tr>

        <td>${withdraw.fullname}</td>

        <td>${withdraw.email}</td>

        <td>$${withdraw.amount}</td>

        <td>${withdraw.method}</td>

        <td>${withdraw.details}</td>

        <td>${withdraw.status}</td>

        <td>
            <button
            onclick="approveWithdrawal('${withdrawDoc.id}','${withdraw.userId}',${withdraw.amount})">
            Approve
            </button>
        </td>

    </tr>

    `;

});
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
window.approveUser = async function(userId) {

    const confirmApproval = confirm(
        "Activate this user's membership?"
    );

    if (!confirmApproval) return;

    try {

        await updateDoc(doc(db, "users", userId), {

            membership: "Active"

        });

        alert("Membership activated successfully.");

        location.reload();

    } catch(error) {

        console.error(error);

        alert("Failed to activate membership.");

    }

};
window.approveWithdrawal = async function(withdrawId,userId,amount){

    if(!confirm("Approve this withdrawal?")){

        return;

    }

    try{

        const userRef = doc(db,"users",userId);

        const snap = await getDoc(userRef);

        if(!snap.exists()){

            alert("User not found.");

            return;

        }

        const data = snap.data();

        const newBalance =
        Number(data.balance || 0) - Number(amount);

        if(newBalance < 0){

            alert("Insufficient balance.");

            return;

        }

        await updateDoc(userRef,{

            balance:newBalance

        });

        await updateDoc(doc(db,"withdrawals",withdrawId),{

            status:"Approved"

        });

        alert("Withdrawal approved successfully.");

        location.reload();

    }catch(error){

        console.error(error);

        alert("Failed to approve withdrawal.");

    }

}
