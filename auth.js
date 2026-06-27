import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location="login.html";
return;

}

const snap=await getDoc(doc(db,"users",user.uid));

if(snap.exists()){

const data=snap.data();

document.getElementById("welcomeName").textContent=data.fullname;

document.getElementById("userBalance").textContent="$"+Number(data.balance).toFixed(2);

document.getElementById("referralEarnings").textContent="$"+Number(data.referralEarnings).toFixed(2);

document.getElementById("accountStatus").textContent=data.membership;

document.getElementById("infoName").textContent=data.fullname;

document.getElementById("infoEmail").textContent=data.email;

document.getElementById("infoPhone").textContent=data.phone || "Not Added";

document.getElementById("infoReferralCode").textContent=data.referralCode;

document.getElementById("infoReferredBy").textContent=data.referredBy || "None";

document.getElementById("userReferralLink").textContent=

window.location.origin+"/register.html?ref="+data.referralCode;

}

});
