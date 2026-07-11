import { auth } from "./firebase.js";

import {
sendPasswordResetEmail
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const form = document.getElementById("resetForm");

const message = document.getElementById("message");

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const email =
    document.getElementById("email").value.trim();

    if(email===""){

        message.innerHTML =
        "<span style='color:red;font-weight:bold;'>Please enter your email address.</span>";

        return;

    }

    try{

        await sendPasswordResetEmail(auth,email);

        message.innerHTML =
        "<span style='color:green;font-weight:bold;'>✅ A password reset link has been sent to your email. Please check your inbox and spam folder.</span>";

        form.reset();

    }catch(error){

        console.error(error);

        message.innerHTML =
        "<span style='color:red;font-weight:bold;'>❌ Unable to send the reset email. Please make sure the email is registered.</span>";

    }

});
