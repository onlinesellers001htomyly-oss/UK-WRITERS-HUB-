import { auth, db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc,
updateDoc,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

async function loadBids(){

const table = document.getElementById("bidsTable");

table.innerHTML = "";

const q = query(
collection(db,"bids"),
where("taskId","==",projectId)
);

const snapshot = await getDocs(q);

if(snapshot.empty){

table.innerHTML = `
<tr>
<td colspan="4">No bids received yet.</td>
</tr>
`;

return;

}

snapshot.forEach((bidDoc)=>{

const bid = bidDoc.data();

table.innerHTML += `

<tr>

<td>${bid.userId}</td>

<td>$${bid.bidAmount}</td>

<td>${bid.status}</td>

<td>

<button onclick="hireWriter('${bidDoc.id}')">

Hire

</button>

</td>

</tr>

`;

});

}

loadBids();

window.hireWriter = async function(bidId){

const bidRef = doc(db,"bids",bidId);

const bidSnap = await getDoc(bidRef);

if(!bidSnap.exists()){

alert("Bid not found.");

return;

}

const bid = bidSnap.data();

await updateDoc(bidRef,{

status:"Accepted"

});

await updateDoc(doc(db,"projects",projectId),{

status:"In Progress",

selectedWriter:bid.userId

});

await addDoc(collection(db,"notifications"),{

userId:bid.userId,

title:"🎉 Congratulations!",

message:"Your bid has been accepted. Start working on the project.",

read:false,

createdAt:serverTimestamp()

});

alert("Writer hired successfully.");

location.reload();

  }
