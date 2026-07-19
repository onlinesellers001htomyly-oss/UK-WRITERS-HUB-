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

<button onclick="placeBid('${doc.id}')">

Place Bid

</button>

</div>

`;

});

}

loadProjects();
