import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

async function loadStatistics(){

const users = await getDocs(collection(db,"users"));
const projects = await getDocs(collection(db,"projects"));
const bids = await getDocs(collection(db,"bids"));
const withdrawals = await getDocs(collection(db,"withdrawals"));

document.getElementById("totalUsers").textContent = users.size;
document.getElementById("totalProjects").textContent = projects.size;
document.getElementById("totalBids").textContent = bids.size;
document.getElementById("totalWithdrawals").textContent = withdrawals.size;

let active = 0;

users.forEach(doc=>{

const user = doc.data();

if(user.membership==="Active"){

active++;

}

});

document.getElementById("activeMembers").textContent = active;

}

loadStatistics();
