import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs,
updateDoc,
addDoc
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
async function activateUser(userId) {

    try {

        await updateDoc(doc(db, "users", userId), {

            membership: "Active"

        });

        alert("User activated successfully!");

        await loadUsers();

    } catch (error) {

        alert(error.message);

    }

}

// Make it available to the button
window.activateUser = activateUser;
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
async function createTask(){

const title=document.getElementById("taskTitle").value.trim();

const description=document.getElementById("taskDescription").value.trim();

const budget=parseFloat(document.getElementById("taskBudget").value);

if(title===""||description===""||isNaN(budget)){

alert("Please complete all task details.");

return;

}

try{

await addDoc(collection(db,"tasks"),{

title:title,

description:description,

budget:budget,

status:"Open",

createdAt:new Date(),

bids:0

});

alert("Task published successfully.");

document.getElementById("taskTitle").value="";

document.getElementById("taskDescription").value="";

document.getElementById("taskBudget").value="";

}catch(error){

alert(error.message);

}

}

window.createTask=createTask;
