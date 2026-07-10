import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const table = document.getElementById("bidsTable");

async function loadBids() {

    table.innerHTML = "";

    const bidsSnapshot = await getDocs(collection(db, "bids"));

    if (bidsSnapshot.empty) {

        table.innerHTML =
        "<tr><td colspan='7'>No bids submitted.</td></tr>";

        return;

    }

    bidsSnapshot.forEach(async (bidDoc) => {

        const bid = bidDoc.data();

        let taskTitle = "Unknown Task";

        const taskSnap = await getDoc(doc(db, "tasks", bid.taskId));

        if (taskSnap.exists()) {

            taskTitle = taskSnap.data().title;

        }

        table.innerHTML += `

        <tr>

            <td>${taskTitle}</td>

            <td>${bid.fullname}</td>

            <td>$${bid.bidAmount}</td>

            <td>${bid.completionDays}</td>

            <td>${bid.proposal}</td>

            <td>${bid.status}</td>

            <td>

                <button
                onclick="acceptBid('${bidDoc.id}','${bid.taskId}','${bid.userId}')">

                Accept

                </button>

            </td>

        </tr>

        `;

    });

}

loadBids();

window.acceptBid = async function(bidId, taskId, userId) {

    if (!confirm("Accept this bid?")) return;

    // Accept the selected bid
    await updateDoc(doc(db, "bids", bidId), {

        status: "Accepted"

    });

    // Assign the task
    await updateDoc(doc(db, "tasks", taskId), {

        status: "Assigned",

        assignedTo: userId

    });

    // Reject every other bid for this task
    const otherBids = query(
        collection(db, "bids"),
        where("taskId", "==", taskId)
    );

    const snapshot = await getDocs(otherBids);

    snapshot.forEach(async (item) => {

        if (item.id !== bidId) {

            await updateDoc(doc(db, "bids", item.id), {

                status: "Rejected"

            });

        }

    });

    alert("✅ Bid accepted successfully.");

    location.reload();

};
