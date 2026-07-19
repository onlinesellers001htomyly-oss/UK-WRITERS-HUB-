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

if(!confirm("Assign this project to this writer?")){

return;

}

try{

const bidRef = doc(db,"bids",bidId);

const bidSnap = await getDoc(bidRef);

if(!bidSnap.exists()){

alert("Bid not found.");

return;

}

const bid = bidSnap.data();

await updateDoc(bidRef,{

status:"Approved"

});

const otherBids = await getDocs(

query(

collection(db,"bids"),

where("projectId","==",bid.projectId)

)

);

otherBids.forEach(async(d)=>{

if(d.id!==bidId){

await updateDoc(doc(db,"bids",d.id),{

status:"Rejected"

});

}

});

await updateDoc(

doc(db,"projects",bid.projectId),

{

status:"Assigned",

assignedTo:bid.userId,

assignedBudget:bid.bidAmount,

assignedDate:serverTimestamp()

}

);

await addDoc(collection(db,"notifications"),{

userId:bid.userId,

title:"🎉 Project Awarded",

message:`Congratulations! Your bid for "${bid.projectTitle}" has been accepted. Please begin working on the project.`,

read:false,

createdAt:serverTimestamp()

});

alert("Project assigned successfully.");

location.reload();

}catch(error){

console.error(error);

alert(error.message);

}

}
