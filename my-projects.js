import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
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

const table = document.getElementById("projectsTable");

table.innerHTML = "";

const q = query(

collection(db,"projects"),

where("clientId","==",user.uid)

);

const snapshot = await getDocs(q);

if(snapshot.empty){

table.innerHTML = `

<tr>

<td colspan="5">

You have not posted any projects yet.

</td>

</tr>

`;

return;

}

snapshot.forEach((projectDoc)=>{

const project = projectDoc.data();

table.innerHTML += `

<tr>

<td>${project.title}</td>

<td>$${project.budget}</td>

<td>${project.deadline}</td>

<td>${project.status}</td>

<td>

<a href="project-bids.html?id=${projectDoc.id}">

View Bids

</a>

</td>

</tr>

`;

});

});
