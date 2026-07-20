import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
updateDoc,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container = document.getElementById("submissionsContainer");

async function loadSubmissions(){

const snapshot = await getDocs(collection(db,"submissions"));

container.innerHTML="";

if(snapshot.empty){

container.innerHTML="<h3>No submissions available.</h3>";

return;

}

snapshot.forEach(sub=>{

const data=sub.data();

container.innerHTML+=`

<div class="project-card">

<h2>${data.projectTitle || "Untitled Project"}</h2>

<p><strong>Writer ID:</strong> ${data.userId}</p>

<p><strong>Status:</strong> ${data.status}</p>

<p>

<a href="${data.fileUrl}" target="_blank">

📥 Download Submitted File

</a>

</p>

<button onclick="approveSubmission('${sub.id}','${data.userId}','${data.projectTitle}')">

Approve

</button>

<button onclick="requestRevision('${sub.id}','${data.userId}','${data.projectTitle}')">

Revision

</button>

<button onclick="rejectSubmission('${sub.id}','${data.userId}','${data.projectTitle}')">

Reject

</button>

</div>

`;

});

}

loadSubmissions();
