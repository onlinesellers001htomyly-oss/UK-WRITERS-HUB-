let allUsers = [];
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
let pendingWithdrawals = 0;
let pendingPayments = 0;
let revenue = 0;
async function loadTasks(){

const snapshot =
await getDocs(collection(db,"tasks"));

document.getElementById("adminTotalTasks").textContent =
snapshot.size;

}
async function loadUsers(){


const table =
document.getElementById("adminUsersTable");


if(!table) return;


table.innerHTML="";


const snapshot =
await getDocs(collection(db,"users"));

allUsers = [];

snapshot.forEach((docSnap)=>{

allUsers.push({

id: docSnap.id,

...docSnap.data()

});

});
let total=0;
let active=0;



snapshot.forEach((userDoc)=>{
    if(withdraw.status === "Pending"){
    pendingWithdrawals++;
    }
if(payment.status === "Pending"){
    pendingPayments++;
}

if(payment.status === "Approved"){
    revenue += Number(payment.amount || 0);
        }

const user=userDoc.data();


total++;


if(user.membership==="Active"){

active++;

}



table.innerHTML += `

function renderUsers(users){

const table =
document.getElementById("adminUsersTable");

table.innerHTML="";

users.forEach(user=>{

table.innerHTML += `

<tr>

<td>${user.fullname || "-"}</td>

<td>${user.email || "-"}</td>

<td>${user.phone || "-"}</td>

<td>${user.membership}</td>

<td>$${Number(user.balance || 0).toFixed(2)}</td>

<td>

<button onclick="approveUser('${user.id}')">

Activate

</button>

</td>

</tr>

`;

});

}



document.getElementById("adminTotalUsers").textContent =
total;


document.getElementById("adminActiveUsers").textContent =
active;


}
renderUsers(allUsers);
// ==============================
// LOAD PAYMENT REQUESTS
// ==============================


async function loadPayments(){


const table =
document.getElementById("paymentsTable");


if(!table) return;


table.innerHTML="";


const snapshot =
await getDocs(collection(db,"payments"));



if(snapshot.empty){

table.innerHTML = `
<tr>
<td colspan="6">
No payment requests.
</td>
</tr>
`;

return;

}



snapshot.forEach((paymentDoc)=>{


const payment = paymentDoc.data();



table.innerHTML += `

<tr>

<td>${user.fullname || user.fullName || "-"}</td>

<td>${payment.email || "-"}</td>

<td>${payment.phone || "-"}</td>

<td>
$${payment.amount || 0}
${payment.currency || "USD"}
</td>


<td>
${payment.status || "Pending"}
</td>


<td>

<button onclick="approveMembership(
'${paymentDoc.id}',
'${payment.userId}'
)">

Approve

</button>

</td>


</tr>

`;


});


}

document.getElementById("adminPendingPayments").textContent =
pendingPayments;

document.getElementById("adminRevenue").textContent =
"$" + revenue.toFixed(2);

document.getElementById("adminPendingWithdrawals").textContent =
pendingWithdrawals;
// ==============================
// APPROVE MEMBERSHIP PAYMENT
// ==============================


window.approveMembership = async function(
paymentId,
userId
){


if(!confirm("Approve this membership payment?")){

return;

}



try{


await updateDoc(

doc(db,"users",userId),

{

membership:"Active"

}

);



// Update payment status


await updateDoc(

doc(db,"payments",paymentId),

{

status:"Approved"

}

);

await addDoc(collection(db,"notifications"),{

userId: userId,

title: "Membership Activated",

message: "Congratulations! Your UK WRITERS HUB membership has been activated.",

read: false,

createdAt: new Date()

});

// Referral bonus

const userSnap =
await getDoc(doc(db,"users",userId));


if(userSnap.exists()){


const user =
userSnap.data();



if(user.referredBy){



const q=query(

collection(db,"users"),

where(
"referralCode",
"==",
user.referredBy
)

);



const refSnapshot =
await getDocs(q);



refSnapshot.forEach(async(refDoc)=>{


const refUser =
refDoc.data();



await updateDoc(

doc(db,"users",refDoc.id),

{

balance:
Number(refUser.balance || 0)+3,


referralEarnings:
Number(refUser.referralEarnings || 0)+3

}

);



});


}



}



alert("Membership approved successfully.");

location.reload();



}catch(error){


console.error(error);

alert(error.message);


}



};



// ==============================
// LOAD WITHDRAWALS
// ==============================


async function loadWithdrawals(){


const table =
document.getElementById("adminWithdrawalsTable");


if(!table) return;


table.innerHTML="";


const snapshot =
await getDocs(collection(db,"withdrawals"));



if(snapshot.empty){

table.innerHTML=`

<tr>

<td colspan="8">

No withdrawal requests found.

</td>

</tr>

`;

return;

}



snapshot.forEach((withdrawDoc)=>{


const withdraw =
withdrawDoc.data();



table.innerHTML += `

<tr>


<td>${withdraw.fullname || "-"}</td>


<td>${withdraw.email || "-"}</td>


<td>
$${withdraw.amount || 0}
</td>


<td>
${withdraw.method || "-"}
</td>


<td>
${withdraw.details || "-"}
</td>


<td>
${withdraw.status || "Pending"}
</td>


<td>
${withdraw.date || "-"}
</td>


<td>

<button onclick="approveWithdrawal(
'${withdrawDoc.id}',
'${withdraw.userId}',
${withdraw.amount}
)">

Approve

</button>


</td>


</tr>


`;

});


        }
// ==============================
// ACTIVATE USER
// ==============================

window.approveUser = async function(userId){

    if(!confirm("Activate this user's membership?")){
        return;
    }

    try{

        await updateDoc(doc(db,"users",userId),{

            membership:"Active"

        });

        alert("Membership activated successfully.");

        location.reload();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

};


// ==============================
// APPROVE WITHDRAWAL
// ==============================

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

        const user = snap.data();

        const balance = Number(user.balance || 0);

        if(balance < Number(amount)){

            alert("Insufficient balance.");

            return;

        }

        await updateDoc(userRef,{

            balance: balance - Number(amount)

        });

        await updateDoc(doc(db,"withdrawals",withdrawId),{

            status:"Approved"

        });

        alert("Withdrawal approved successfully.");

        location.reload();

    }catch(error){

        console.error(error);

        alert(error.message);

    }

};


// ==============================
// CREATE TASK
// ==============================

window.createTask = async function(){

    const title =
    document.getElementById("taskTitle").value.trim();

    const description =
    document.getElementById("taskDescription").value.trim();

    const budget =
    Number(document.getElementById("taskBudget").value);

    if(title==="" || description==="" || budget<=0){

        alert("Please complete all task details.");

        return;

    }

    try{

        await addDoc(collection(db,"tasks"),{

            title,

            description,

            budget,

            status:"Open",

            bids:0,

            createdAt:new Date()

        });

        alert("Task published successfully.");

        document.getElementById("taskTitle").value="";

        document.getElementById("taskDescription").value="";

        document.getElementById("taskBudget").value="";

    }catch(error){

        console.error(error);

        alert(error.message);

    }

};
const search =
document.getElementById("adminSearch");

const filter =
document.getElementById("adminFilter");

if(search){

search.addEventListener("input",filterUsers);

}

if(filter){

filter.addEventListener("change",filterUsers);

}

function filterUsers(){

const keyword =
search.value.toLowerCase();

const status =
filter.value;

const filtered =
allUsers.filter(user=>{

const matchText=

(user.fullname || "").toLowerCase().includes(keyword)

||

(user.email || "").toLowerCase().includes(keyword)

||

(user.phone || "").toLowerCase().includes(keyword);

const matchStatus=

status==="All"

||

user.membership===status;

return matchText && matchStatus;

});

renderUsers(filtered);

}
window.publishAnnouncement = async function(){

const title =
document.getElementById("announcementTitle").value.trim();

const message =
document.getElementById("announcementMessage").value.trim();

if(title==="" || message===""){

alert("Please complete all fields.");

return;

}

try{

await addDoc(collection(db,"announcements"),{

title,

message,

status:"Active",

createdAt:new Date()

});

alert("Announcement published successfully.");

document.getElementById("announcementTitle").value="";

document.getElementById("announcementMessage").value="";

}catch(error){

console.error(error);

alert(error.message);

}

};
