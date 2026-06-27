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

    const userRef=doc(db,"users",user.uid);

    const userSnap=await getDoc(userRef);

    if(userSnap.exists()){

        const data=userSnap.data();

        document.getElementById("fullname").innerHTML=data.fullname;

        document.getElementById("balance").innerHTML="$"+data.balance;

        document.getElementById("referrals").innerHTML=data.totalReferrals;

        document.getElementById("membership").innerHTML=data.membership;

    }

});
