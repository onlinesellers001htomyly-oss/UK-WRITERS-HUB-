import {auth,db} from "./firebase.js";


import {

onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


import {

doc,
getDoc

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



onAuthStateChanged(auth,async(user)=>{


if(!user){

window.location="login.html";

return;

}



const snap =
await getDoc(
doc(db,"users",user.uid)
);



if(!snap.exists()){

alert("Profile not found");

return;

}



const data=snap.data();



document.getElementById("profileName").textContent =
data.fullname;



document.getElementById("profileEmail").textContent =
data.email;



document.getElementById("profilePhone").textContent =
data.phone || "-";



document.getElementById("profileCountry").textContent =
data.country || "Kenya";



document.getElementById("profileEarnings").textContent =
"$"+Number(data.taskEarnings || 0);



document.getElementById("profileReferral").textContent =
"$"+Number(data.referralEarnings || 0);



document.getElementById("profileProjects").textContent =
data.completedProjects || 0;



document.getElementById("profileMembership").textContent =
data.membership;



let badge="🌱 Beginner Writer";


if(data.taskEarnings>1000){

badge="👑 Elite Writer";

}

else if(data.taskEarnings>500){

badge="💎 Professional Writer";

}

else if(data.taskEarnings>100){

badge="⭐ Rising Writer";

}



document.getElementById("writerBadge").textContent=badge;


});
