import { db } from "./firebase.js";

import {

collection,

getDocs,

doc,

getDoc,

updateDoc

}

from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const table = document.getElementById("bidsTable");

async function loadBids(){

table.innerHTML="";

const bids = await getDocs(collection(db,"bids"));

if(bids.empty){

table.innerHTML=

"<tr><td colspan='7'>No bids submitted.</td></tr>";

return;

}

bids.forEach(async(bidDoc)=>{

const bid=bidDoc.data();

let taskTitle="Unknown Task";

const taskSnap=await getDoc(doc(db,"tasks",bid.taskId));

if(taskSnap.exists()){

taskTitle=taskSnap.data().title;

}

table.innerHTML+=`

<tr>

<td>${taskTitle}</td>

<td>${bid.fullname}</td>

<td>$${bid.bidAmount}</td>

<td>${bid.completionDays}</td>

<td>${bid.proposal}</td>

<td>${bid.status}</td>

<td>

<button

onclick="acceptBid('${bidDoc.id}','${bid.taskId}','${bid.userId}')">

Accept

</button>

</td>

</tr>

`;

});

}

loadBids();

window.acceptBid=async function(bidId,taskId,userId){

if(!confirm("Accept this bid?")){

return;

}

await updateDoc(doc(db,"bids",bidId),{

status:"Accepted"

});

await updateDoc(doc(db,"tasks",taskId),{

status:"Assigned",

assignedTo:userId

});

alert("Bid accepted successfully.");

location.reload();

}
