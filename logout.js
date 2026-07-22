import { auth } from "./firebase.js";

import {
signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

signOut(auth)

.then(()=>{

alert("You have logged out successfully.");

window.location="login.html";

})

.catch((error)=>{

alert(error.message);

});
