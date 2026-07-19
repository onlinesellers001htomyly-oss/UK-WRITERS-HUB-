import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
collection,
addDoc,
query,
where,
orderBy,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentUser=null;

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="login.html";

return;

}

currentUser=user;

loadMessages();

});

function loadMessages(){

const q=query(

collection(db,"chats"),

where("userId","==",currentUser.uid),

orderBy("createdAt")

);

onSnapshot(q,(snapshot)=>{

const box=document.getElementById("chatMessages");

box.innerHTML="";

snapshot.forEach(doc=>{

const m=doc.data();

box.innerHTML+=`

<div class="${m.sender}">

<strong>${m.sender}</strong>

<p>${m.message}</p>

</div>

`;

});

box.scrollTop=box.scrollHeight;

});

}

window.sendMessage = async function(){

const text = document.getElementById("chatMessage").value.trim();

if(text==="") return;

await addDoc(collection(db,"chats"),{

userId: currentUser.uid,

sender: "Member",

receiver: "Admin",

message: text,

read: false,

createdAt: serverTimestamp()

});

document.getElementById("chatMessage").value="";

}
