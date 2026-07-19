import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth,(user)=>{

if(!user){

window.location="login.html";

return;

}

const q=query(

collection(db,"chats"),

orderBy("createdAt","desc")

);

onSnapshot(q,(snapshot)=>{

const list=document.getElementById("chatList");

list.innerHTML="";

snapshot.forEach(doc=>{

const chat=doc.data();

list.innerHTML+=`

<div class="chat-card">

<h3>${chat.sender}</h3>

<p>${chat.message}</p>

<small>${chat.userId}</small>

<button onclick="replyToUser('${chat.userId}')">

Reply

</button>

</div>

`;

});

});

});

window.replyToUser=function(userId){

window.location="reply.html?user="+userId;

  }
