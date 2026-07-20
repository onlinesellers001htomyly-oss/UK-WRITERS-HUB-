import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
getDoc,
addDoc,
serverTimestamp,
query,
where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container=document.getElementById("bidsContainer");

async function loadBids(){

const snapshot=await getDocs(collection(db,"bids"));

container.innerHTML="";

snapshot.forEach(doc=>{

const bid=doc.data();

container.innerHTML+=`

<div class="project-card">

<h2>${bid.projectTitle}</h2>

<p><strong>Bid:</strong> $${bid.bidAmount}</p>

<p><strong>Delivery:</strong> ${bid.deliveryDays} days</p>

<p><strong>Status:</strong> ${bid.status}</p>

<button onclick="approveBid('${doc.id}')">

Approve Writer

</button>

</div>

`;

});

}

loadBids();
window.approveBid = async function(bidId){

try{

const bidRef = doc(db,"bids",bidId);

const bidSnap = await getDoc(bidRef);

if(!bidSnap.exists()){

alert("Bid not found.");

return;

}

const bid = bidSnap.data();

// Approve selected bid

await updateDoc(bidRef,{

status:"Approved"

});

// Reject all other bids for this project

const otherBids = query(

collection(db,"bids"),

where("projectId","==",bid.projectId)

);

const snapshot = await getDocs(otherBids);

snapshot.forEach(async(d)=>{

if(d.id!==bidId){

await updateDoc(doc(db,"bids",d.id),{

status:"Rejected"

});

}

});

// Update project

await updateDoc(doc(db,"projects",bid.projectId),{

status:"Assigned",

assignedTo:bid.userId

});

// Create notification

await addDoc(collection(db,"notifications"),{

userId:bid.userId,

title:"Project Awarded",

message:`🎉 Congratulations! Your bid for "${bid.projectTitle}" has been accepted. Please begin working on the project.`,

read:false,

createdAt:serverTimestamp()

});

alert("Writer approved successfully.");

location.reload();

}catch(error){

console.error(error);

alert(error.message);

}

}
