import { db } from "./firebase.js";

import {
collection,
getDocs,
doc,
getDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const table = document.getElementById("tasksTable");

async function loadTasks(){

table.innerHTML="";

const snapshot=await getDocs(collection(db,"tasks"));

if(snapshot.empty){

table.innerHTML=
"<tr><td colspan='5'>No assigned tasks.</td></tr>";

return;

}

snapshot.forEach(async(taskDoc)=>{

const task=taskDoc.data();

if(task.status!="Assigned") return;

let freelancer="Not Assigned";

if(task.assignedTo){

const userSnap=
await getDoc(doc(db,"users",task.assignedTo));

if(userSnap.exists()){

freelancer=userSnap.data().fullname;

}

}

table.innerHTML+=`

<tr>

<td>${task.title}</td>

<td>$${task.budget}</td>

<td>${task.status}</td>

<td>${freelancer}</td>

<td>

<button
onclick="completeTask('${taskDoc.id}','${task.assignedTo}',${task.budget})">

Complete Task

</button>

</td>

</tr>

`;

});

}

loadTasks();

window.completeTask=async function(taskId,userId,budget){

if(!confirm("Mark this task as completed?")){

return;

}

try{

const userRef=doc(db,"users",userId);

const userSnap=await getDoc(userRef);

const user=userSnap.data();

await updateDoc(userRef,{

balance:Number(user.balance||0)+Number(budget)

});

await updateDoc(doc(db,"tasks",taskId),{

status:"Completed"

});

alert("✅ Task completed successfully.");

location.reload();

}catch(error){

console.error(error);

alert("❌ Failed to complete task.");

}

  }
