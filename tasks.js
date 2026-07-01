import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs,
addDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async(user)=>{

if(!user){

window.location="login.html";

return;

}

const userSnap=await getDoc(doc(db,"users",user.uid));

if(!userSnap.exists()){

alert("User not found.");

return;

}

const userData=userSnap.data();

if(userData.membership!=="Active"){

document.getElementById("membershipWarning").innerHTML=
"❌ Your membership is Pending. Activate your account first.";

document.getElementById("tasksContainer").innerHTML="";

return;

}

const snapshot=await getDocs(collection(db,"tasks"));

const container=document.getElementById("tasksContainer");

container.innerHTML="";

snapshot.forEach(task=>{

const data=task.data();

container.innerHTML+=`

<div class="task">

<h2>${data.title}</h2>

<p>${data.description}</p>

<p class="price">$${data.budget}</p>

<button onclick="placeBid('${task.id}')">

Place Bid

</button>

</div>

`;

});

});

window.placeBid=function(taskId){

alert("Bidding system coming in the next step.\nTask ID: "+taskId);

};
