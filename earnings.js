import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc,
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location="login.html";

return;

}

const userSnap=await getDoc(doc(db,"users",user.uid));

const userData=userSnap.data();

document.getElementById("balance").textContent=
"$"+Number(userData.balance||0).toFixed(2);

document.getElementById("taskEarnings").textContent=
"$"+Number(userData.taskEarnings||0).toFixed(2);

document.getElementById("referralEarnings").textContent=
"$"+Number(userData.referralEarnings||0).toFixed(2);

const q=query(

collection(db,"paymentsHistory"),

where("userId","==",user.uid)

);

const snapshot=await getDocs(q);

const container=document.getElementById("paymentsHistory");

container.innerHTML="";

if(snapshot.empty){

container.innerHTML="<p>No payments yet.</p>";

return;

}

snapshot.forEach(payment=>{

const p=payment.data();

container.innerHTML+=`

<div class="card">

<h4>${p.projectTitle}</h4>

<p><strong>Amount:</strong> $${p.amount}</p>

<p><strong>Status:</strong> ${p.status}</p>

</div>

`;

});

});
