import { auth, db } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

window.submitProject = async function () {

const projectId = document.getElementById("projectId").value.trim();

const message = document.getElementById("submissionMessage").value.trim();

const file = document.getElementById("projectFile").files[0];

if (!projectId || !file) {

alert("Please enter the Project ID and select a file.");

return;

}

const user = auth.currentUser;

if (!user) {

alert("Please login first.");

return;

}

await addDoc(collection(db, "projectSubmissions"), {

projectId: projectId,

writerId: user.uid,

writerEmail: user.email,

fileName: file.name,

message: message,

status: "Submitted",

createdAt: serverTimestamp()

});

alert("Project submitted successfully.");

document.getElementById("projectId").value = "";

document.getElementById("submissionMessage").value = "";

document.getElementById("projectFile").value = "";

};
