import {
collection,
getDocs,
doc,
getDoc,
updateDoc,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container = document.getElementById("submissionsContainer");

async function loadSubmissions(){

const snapshot = await getDocs(collection(db,"submissions"));

container.innerHTML="";

if(snapshot.empty){

container.innerHTML="<h3>No submissions available.</h3>";

return;

}

snapshot.forEach(sub=>{

const data=sub.data();

container.innerHTML+=`

<div class="project-card">

<h2>${data.projectTitle || "Untitled Project"}</h2>

<p><strong>Writer ID:</strong> ${data.userId}</p>

<p><strong>Status:</strong> ${data.status}</p>

<p>

<a href="${data.fileUrl}" target="_blank">

📥 Download Submitted File

</a>

</p>

<button onclick="approveSubmission('${sub.id}','${data.userId}','${data.projectTitle}')">

Approve

</button>

<button onclick="requestRevision('${sub.id}','${data.userId}','${data.projectTitle}')">

Revision

</button>

<button onclick="rejectSubmission('${sub.id}','${data.userId}','${data.projectTitle}')">

Reject

</button>

</div>

`;

});

}

loadSubmissions();
window.approveSubmission = async function(id,userId,title){

try{

const submissionRef = doc(db,"submissions",id);

const submissionSnap = await getDoc(submissionRef);

if(!submissionSnap.exists()){

alert("Submission not found.");

return;

}

const submission = submissionSnap.data();

const userRef = doc(db,"users",userId);

const userSnap = await getDoc(userRef);

if(!userSnap.exists()){

alert("User not found.");

return;

}

const user = userSnap.data();

const payment = Number(submission.payment || 0);

await updateDoc(userRef,{

balance:Number(user.balance || 0)+payment,

taskEarnings:Number(user.taskEarnings || 0)+payment

});

await updateDoc(submissionRef,{

status:"Approved",

paymentReleased:true

});

await addDoc(collection(db,"paymentsHistory"),{

userId,

projectTitle:title,

amount:payment,

status:"Paid",

createdAt:serverTimestamp()

});

await addDoc(collection(db,"notifications"),{

userId,

title:"Payment Released",

message:`💰 Your payment of $${payment} for "${title}" has been released successfully.`,

read:false,

createdAt:serverTimestamp()

});

alert("Project approved and payment released.");

location.reload();

}catch(error){

console.error(error);

alert(error.message);

}

}
