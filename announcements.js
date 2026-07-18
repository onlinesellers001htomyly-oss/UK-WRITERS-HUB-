import { db } from "./firebase.js";

import {
collection,
query,
where,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container =
document.getElementById("announcementsContainer");

if(container){

const q=query(
collection(db,"announcements"),
where("status","==","Active"),
orderBy("createdAt","desc")
);

onSnapshot(q,(snapshot)=>{

container.innerHTML="";

snapshot.forEach(doc=>{

const data=doc.data();

container.innerHTML += `

<div class="announcement-card">

<h3>📢 ${data.title}</h3>

<p>${data.message}</p>

</div>

`;

});

});

                        }
