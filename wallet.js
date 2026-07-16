import { auth, db } from "./firebase.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { doc, getDoc }
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location="login.html";

return;

}

const snap=await getDoc(doc(db,"users",user.uid));

if(!snap.exists()) return;

const data=snap.data();

document.getElementById("availableBalance").textContent=
"$"+Number(data.availableBalance||0).toFixed(2);

document.getElementById("pendingBalance").textContent=
"$"+Number(data.pendingBalance||0).toFixed(2);

document.getElementById("withdrawnTotal").textContent=
"$"+Number(data.withdrawnTotal||0).toFixed(2);

document.getElementById("lifetimeEarnings").textContent=
"$"+Number(data.lifetimeEarnings||0).toFixed(2);

});
