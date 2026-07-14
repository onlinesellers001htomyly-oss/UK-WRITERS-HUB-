function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

/* -------------------------
   GET BASE URL
-------------------------- */
function getBaseUrl() {
  const isLocalFile = window.location.protocol === "file:";
  if (isLocalFile) {
    return "register.html";
  }

  const path = window.location.pathname;
  const basePath = path.substring(0, path.lastIndexOf("/") + 1);
  return window.location.origin + basePath + "register.html";
}



window.logoutUser = async function () {

    const { auth } = await import("./firebase.js");

    const { signOut } = await import(
        "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"
    );

    await signOut(auth);

    window.location = "login.html";

};
