function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  if (menu) {
    menu.classList.toggle("show");
  }
}

/* -------------------------
   REGISTER USER
-------------------------- */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const referralCode = document.getElementById("referralCode").value.trim();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("ukwh_users")) || [];

    const existingUser = users.find(
      user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      alert("An account with this email already exists.");
      return;
    }

    const generatedReferralCode = "UKWH" + Math.floor(100000 + Math.random() * 900000);

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      phone,
      password,
      referralCode: generatedReferralCode,
      referredBy: referralCode || "",
      balance: 0,
      referralEarnings: 0,
      active: false,
      joinFeePaid: false,
      withdrawals: []
    };

    users.push(newUser);
    localStorage.setItem("ukwh_users", JSON.stringify(users));

    alert("Registration successful! You can now login.");
    window.location.href = "login.html";
  });
}

/* -------------------------
   LOGIN USER
-------------------------- */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("ukwh_users")) || [];

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    localStorage.setItem("ukwh_logged_in_user", JSON.stringify(user));

    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
      }
