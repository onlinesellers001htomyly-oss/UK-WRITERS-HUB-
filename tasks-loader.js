import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const container = document.getElementById("tasksContainer");

async function loadTasks() {

    container.innerHTML = "";

    const snapshot = await getDocs(collection(db, "tasks"));

    if (snapshot.empty) {

        container.innerHTML = "<p>No tasks available.</p>";

        return;

    }

    snapshot.forEach((taskDoc) => {

        const task = taskDoc.data();

        container.innerHTML += `

        <div class="task">

            <h2>${task.title}</h2>

            <p>${task.description}</p>

            <p><strong>Category:</strong> ${task.category}</p>

            <p><strong>Deadline:</strong> ${task.deadline}</p>

            <p class="price">$${task.budget}</p>

            <button onclick="alert('Bidding feature coming next.')">

                Place Bid

            </button>

        </div>

        `;

    });

}

loadTasks();
