import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
collection,
query,
where,
orderBy,
onSnapshot,
updateDoc,
doc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const bell = document.getElementById("notificationBell");
const panel = document.getElementById("notificationPanel");
const list = document.getElementById("notificationList");
const count = document.getElementById("notificationCount");

let opened = false;

if (bell) {

bell.addEventListener("click", () => {

opened = !opened;

panel.style.display = opened ? "block" : "none";

});

}

onAuthStateChanged(auth, (user) => {

if (!user) return;

const q = query(
collection(db, "notifications"),
where("userId", "==", user.uid),
orderBy("createdAt", "desc")
);

onSnapshot(q, async(snapshot) => {

list.innerHTML = "";

let unread = 0;

if (snapshot.empty) {

list.innerHTML = "<p>No notifications available.</p>";

count.textContent = "0";

return;

}

snapshot.forEach(async(docSnap) => {

const data = docSnap.data();

if (!data.read) unread++;

list.innerHTML += `

<div class="notification-item">

<strong>${data.title}</strong>

<p>${data.message}</p>

<small>${data.time || ""}</small>

</div>

`;

if (opened && !data.read) {

await updateDoc(doc(db, "notifications", docSnap.id), {

read: true

});

}

});

count.textContent = unread;

});

});
