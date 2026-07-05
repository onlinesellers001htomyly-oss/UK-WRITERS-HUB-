import { auth, db } from "./firebase.js";

import {
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const phoneInput = document.getElementById("phone");

const payBtn = document.getElementById("payBtn");

const paymentMessage = document.getElementById("paymentMessage");

const membershipStatus = document.getElementById("membershipStatus");

let currentUser = null;

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location="login.html";

return;

}

currentUser=user;

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

membershipStatus.innerText=snap.data().membership;

}

});

payBtn.addEventListener("click",async()=>{

const phone=phoneInput.value.trim();

if(phone==""){

paymentMessage.innerHTML="<span class='error'>Please enter your phone number.</span>";

return;

}

/*

This is where Daraja STK Push will be called later.

*/

paymentMessage.innerHTML="⏳ Processing payment...";

setTimeout(async()=>{

await updateDoc(doc(db,"users",currentUser.uid),{

membership:"Active"

});

membershipStatus.innerText="Active";

paymentMessage.innerHTML="<span class='success'>✅ Membership activated successfully.</span>";

setTimeout(()=>{

window.location="dashboard.html";

},2000);

},3000);

});
