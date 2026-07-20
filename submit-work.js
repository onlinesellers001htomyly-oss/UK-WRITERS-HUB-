import {auth,db} from "./firebase.js";


import {

ref,

uploadBytes,

getDownloadURL

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";


import {

collection,

addDoc,

serverTimestamp

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";



let user;



auth.onAuthStateChanged((u)=>{

user=u;

});




window.submitWork = async function(){


const file =
document.getElementById("workFile").files[0];


if(!file){

alert("Please select a file.");

return;

}


if(!user){

alert("Please login first.");

return;

}



try{


const storageRef =
ref(
storage,
"submissions/"+user.uid+"/"+file.name
);



await uploadBytes(storageRef,file);



const url =
await getDownloadURL(storageRef);



await addDoc(collection(db,"submissions"),{


userId:user.uid,

fileName:file.name,

fileUrl:url,

status:"Pending Review",

submittedAt:serverTimestamp()


});



document.getElementById("message").innerHTML=

"✅ Work submitted successfully.";



}catch(error){


console.error(error);

alert(error.message);


}


}
