import { db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const form = document.getElementById("taskForm");

const message = document.getElementById("message");

form.addEventListener("submit", async(e)=>{

e.preventDefault();

try{

await addDoc(collection(db,"tasks"),{

title:document.getElementById("title").value,

category:document.getElementById("category").value,

budget:Number(document.getElementById("budget").value),

deadline:document.getElementById("deadline").value,

description:document.getElementById("description").value,

status:"Open",

assignedTo:"",

createdAt:serverTimestamp()

});

message.innerHTML=
"<span style='color:green;font-weight:bold;'>✅ Task created successfully.</span>";

form.reset();

}catch(error){

console.error(error);

message.innerHTML=
"<span style='color:red;'>Failed to create task.</span>";

}

});
