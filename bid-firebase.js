import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const params = new URLSearchParams(window.location.search);
const taskId = params.get("task");

let currentUser = null;
let currentUserData = null;

onAuthStateChanged(auth, async(user)=>{

    if(!user){

        window.location = "login.html";

        return;

    }

    currentUser = user;

    const userSnap = await getDoc(doc(db,"users",user.uid));

    if(userSnap.exists()){

        currentUserData = userSnap.data();

    }

    const taskSnap = await getDoc(doc(db,"tasks",taskId));

    if(taskSnap.exists()){

        const task = taskSnap.data();

        document.getElementById("taskTitle").textContent =
        task.title;

        document.getElementById("taskDescription").textContent =
        task.description;

        document.getElementById("taskDeadline").textContent =
        task.deadline;

        document.getElementById("taskBudget").textContent =
        task.budget;

    }else{

        alert("Task not found.");

        window.location = "tasks.html";

    }

});

document.getElementById("bidForm")
.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const bidAmount =
    Number(document.getElementById("bidAmount").value);

    const completionDays =
    Number(document.getElementById("completionDays").value);

    const proposal =
    document.getElementById("proposal").value;

    try{

        await addDoc(collection(db,"bids"),{

            taskId:taskId,

            userId:currentUser.uid,

            fullname:currentUserData.fullname,

            email:currentUserData.email,

            bidAmount:bidAmount,

            completionDays:completionDays,

            proposal:proposal,

            status:"Pending",

            createdAt:serverTimestamp()

        });

        document.getElementById("message").innerHTML =
        "<span style='color:green;font-weight:bold;'>✅ Bid submitted successfully.</span>";

        document.getElementById("bidForm").reset();

    }catch(error){

        console.error(error);

        document.getElementById("message").innerHTML =
        "<span style='color:red;font-weight:bold;'>❌ Failed to submit bid.</span>";

    }

});
