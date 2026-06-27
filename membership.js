import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth,async(user)=>{

if(!user){

window.location="login.html";

return;

}

const snap=await getDoc(doc(db,"users",user.uid));

const data=snap.data();

if(data.membership!="Active"){

alert("Activate your membership first.");

window.location="deposit.html";

}

});
