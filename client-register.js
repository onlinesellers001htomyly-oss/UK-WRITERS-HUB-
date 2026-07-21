import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
setDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const form = document.getElementById("clientForm");

form.addEventListener("submit", async(e)=>{

e.preventDefault();

const company=document.getElementById("company").value.trim();

const fullname=document.getElementById("fullname").value.trim();

const email=document.getElementById("email").value.trim().toLowerCase();

const phone=document.getElementById("phone").value.trim();

const password=document.getElementById("password").value;

try{

const userCredential=

await createUserWithEmailAndPassword(

auth,

email,

password

);

const user=userCredential.user;

await setDoc(doc(db,"clients",user.uid),{

company,

fullname,

email,

phone,

role:"client",

status:"Active",

createdAt:serverTimestamp()

});

alert("Client account created successfully.");

window.location="client-dashboard.html";

}catch(error){

alert(error.message);

}

});
