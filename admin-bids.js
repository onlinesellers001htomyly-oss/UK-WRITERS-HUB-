import { db } from "./firebase.js";

import {

collection,

getDocs

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
