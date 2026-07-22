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

const userRef = doc(db,"users",user.uid);

const snap = await getDoc(userRef);

if(!snap.exists()){

alert("User profile not found.");

window.location="login.html";

return;

}

const data = snap.data();

if(data.role==="admin"){

window.location="admin.html";

return;

}

if(data.role==="member"){

window.location="dashboard.html";

return;

}

if(data.role==="client"){

document.querySelector("h2").innerHTML =
"Welcome, " + data.fullname;

}

});
