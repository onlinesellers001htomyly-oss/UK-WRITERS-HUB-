import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc,
    getDocs,
    collection,
    updateDoc,
    query,
    where,
    addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";


// ADMIN CHECK

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location = "login.html";
        return;

    }


    const adminSnap = await getDoc(
        doc(db,"users",user.uid)
    );


    if(!adminSnap.exists()){

        alert("Admin profile not found.");
        window.location="login.html";
        return;

    }


    const adminData = adminSnap.data();


    if(adminData.role !== "admin"){

        alert("Access denied. Administrator only.");

        window.location="dashboard.html";

        return;

    }


    console.log("Admin verified successfully");


    loadUsers();

    loadPayments();

    loadWithdrawals();

});



// ==============================
// LOAD USERS
// ==============================


async function loadUsers(){


const table =
document.getElementById("adminUsersTable");


if(!table) return;


table.innerHTML="";


const snapshot =
await getDocs(collection(db,"users"));


let total=0;
let active=0;



snapshot.forEach((userDoc)=>{


const user=userDoc.data();


total++;


if(user.membership==="Active"){

active++;

}



table.innerHTML += `

<tr>

<td>${user.fullname || "-"}</td>

<td>${user.email || "-"}</td>

<td>${user.phone || "-"}</td>

<td>${user.referralCode || "-"}</td>

<td>${user.referredBy || "None"}</td>

<td>
$${Number(user.balance || 0).toFixed(2)}
</td>

<td>
$${Number(user.referralEarnings || 0).toFixed(2)}
</td>


<td>
${user.membership || "Pending"}
</td>


<td>

<button onclick="approveUser('${userDoc.id}')">

Activate

</button>

</td>


</tr>

`;

});



document.getElementById("adminTotalUsers").textContent =
total;


document.getElementById("adminActiveUsers").textContent =
active;


}
