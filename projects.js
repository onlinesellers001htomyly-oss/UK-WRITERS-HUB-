import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container =
document.getElementById("projectsContainer");

async function loadProjects(){

const snapshot =
await getDocs(collection(db,"projects"));

container.innerHTML="";

snapshot.forEach(doc=>{

const p=doc.data();

container.innerHTML+=`

<div class="project-card">

<h2>${p.title}</h2>

<p>${p.description}</p>

<p><strong>Category:</strong> ${p.category}</p>

<p><strong>Budget:</strong> $${p.budget}</p>

<p><strong>Deadline:</strong> ${p.deadline}</p>

<button onclick="placeBid('${doc.id}','${p.title}',${p.budget})">

Place Bid

</button>

`;

});

}

loadProjects();
import { auth } from "./firebase.js";

import {
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

window.placeBid = async function(projectId,title,budget){

const user = auth.currentUser;

if(!user){

alert("Please login first.");

return;

}

const amount = prompt("Enter your bid amount (USD)");

if(amount===null) return;

const days = prompt("How many days will you take?");

if(days===null) return;

try{

await addDoc(collection(db,"bids"),{

projectId,

projectTitle:title,

projectBudget:budget,

userId:user.uid,

bidAmount:Number(amount),

deliveryDays:Number(days),

status:"Pending",

createdAt:serverTimestamp()

});

alert("✅ Your bid has been submitted successfully.");

}catch(error){

alert(error.message);

}

}
