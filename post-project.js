import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {

if (!user) {

window.location = "login.html";

return;

}

currentUser = user;

});

window.postProject = async function () {

const title = document.getElementById("title").value.trim();

const description = document.getElementById("description").value.trim();

const budget = Number(document.getElementById("budget").value);

const deadline = document.getElementById("deadline").value;

if (!title || !description || budget <= 0 || !deadline) {

alert("Please complete all fields.");

return;

}

try {

await addDoc(collection(db, "projects"), {

clientId: currentUser.uid,

clientEmail: currentUser.email,

title,

description,

budget,

deadline,

status: "Open",

createdAt: serverTimestamp()

});

alert("✅ Project posted successfully.");

document.getElementById("title").value = "";

document.getElementById("description").value = "";

document.getElementById("budget").value = "";

document.getElementById("deadline").value = "";

} catch (error) {

console.error(error);

alert(error.message);

}

};
