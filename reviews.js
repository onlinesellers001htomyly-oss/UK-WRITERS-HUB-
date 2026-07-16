import {auth,db} from "./firebase.js";


import {

collection,
addDoc,
query,
where,
getDocs,
orderBy

} from 
"https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



import {

onAuthStateChanged

} from
"https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";




const container =
document.getElementById("reviewsContainer");


const summary =
document.getElementById("reviewSummary");



onAuthStateChanged(auth,async(user)=>{


if(!user){

window.location="login.html";

return;

}



loadReviews(user.uid);



});




async function loadReviews(writerId){


const q=query(

collection(db,"reviews"),

where("writerId","==",writerId),

orderBy("createdAt","desc")

);



const snapshot=await getDocs(q);



container.innerHTML="";


let total=0;

let stars=0;



if(snapshot.empty){

container.innerHTML=
"<p>No reviews yet.</p>";

summary.innerHTML=
"⭐ No ratings available";

return;

}



snapshot.forEach(doc=>{


const review=doc.data();



total++;

stars += Number(review.rating);



container.innerHTML += `

<div class="review-box">


<h3>
⭐ ${review.rating}/5
</h3>


<p>
${review.comment}
</p>


<small>
Client: ${review.clientName}
</small>


</div>

`;

});



const average =
(stars/total).toFixed(1);



summary.innerHTML=

`

<h2>
⭐ ${average}/5
</h2>

<p>
${total} Client Reviews
</p>

`;

  }
