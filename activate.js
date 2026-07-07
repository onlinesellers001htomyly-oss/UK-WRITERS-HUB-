import { auth, db } from "./firebase.js";

import {
doc,
getDoc,
collection,
addDoc,
serverTimestamp
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
    await addDoc(collection(db, "payments"), {

    userId: currentUser.uid,

    fullname: (await getDoc(doc(db, "users", currentUser.uid))).data().fullname,

    email: currentUser.email,

    phone: phone,

    amount: 10,

    currency: "USD",

    tillNumber: "6892947",

    paymentMethod: "M-PESA",

    status: "Pending",

    createdAt: serverTimestamp()

});

await addDoc(collection(db, "payments"), {
    userId: currentUser.uid,
    phone: phone,
    amount: 10,
    status: "Pending",
    createdAt: serverTimestamp()
});

paymentMessage.innerHTML =
"<span class='success'>✅ Payment request submitted successfully. Please complete your M-PESA payment. Your membership will be activated after payment confirmation.</span>";

});
