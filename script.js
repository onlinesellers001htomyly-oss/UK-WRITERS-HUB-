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

/* -------------------------
   DASHBOARD LOADER
-------------------------- */
function loadDashboard() {
  const welcomeName = document.getElementById("welcomeName");
  if (!welcomeName) return;

  const loggedInUser = JSON.parse(localStorage.getItem("ukwh_logged_in_user"));

  if (!loggedInUser) {
    alert("You must login first.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcomeName").textContent = loggedInUser.fullName || "User";
  document.getElementById("userBalance").textContent = "$" + Number(loggedInUser.balance || 0).toFixed(2);
  document.getElementById("referralEarnings").textContent = "$" + Number(loggedInUser.referralEarnings || 0).toFixed(2);
  document.getElementById("accountStatus").textContent = loggedInUser.active ? "Active" : "Inactive";

  const referralLink = `https://ukwritershub.com/register.html?ref=${loggedInUser.referralCode}`;
  document.getElementById("userReferralLink").textContent = referralLink;

  document.getElementById("infoName").textContent = loggedInUser.fullName || "-";
  document.getElementById("infoEmail").textContent = loggedInUser.email || "-";
  document.getElementById("infoPhone").textContent = loggedInUser.phone || "-";
  document.getElementById("infoReferralCode").textContent = loggedInUser.referralCode || "-";
  document.getElementById("infoReferredBy").textContent = loggedInUser.referredBy || "None";

  const withdrawalBox = document.getElementById("withdrawalHistory");
  if (withdrawalBox) {
    const withdrawals = loggedInUser.withdrawals || [];

    if (!withdrawals.length) {
      withdrawalBox.innerHTML = "<p>No withdrawals yet.</p>";
    } else {
      withdrawalBox.innerHTML = withdrawals
        .map(
          (w) => `
            <div class="withdraw-item">
              <p><strong>Amount:</strong> $${Number(w.amount).toFixed(2)}</p>
              <p><strong>Method:</strong> ${w.method}</p>
              <p><strong>Details:</strong> ${w.details}</p>
              <p><strong>Status:</strong> ${w.status}</p>
              <p><strong>Date:</strong> ${w.date}</p>
            </div>
          `
        )
        .join("");
    }
  }
}

/* -------------------------
   WITHDRAWAL REQUEST
-------------------------- */
const withdrawForm = document.getElementById("withdrawForm");

if (withdrawForm) {
  withdrawForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById("withdrawAmount").value);
    const method = document.getElementById("withdrawMethod").value;
    const details = document.getElementById("withdrawDetails").value.trim();

    let loggedInUser = JSON.parse(localStorage.getItem("ukwh_logged_in_user"));
    let users = JSON.parse(localStorage.getItem("ukwh_users")) || [];

    if (!loggedInUser) {
      alert("You must login first.");
      window.location.href = "login.html";
      return;
    }

    if (!amount || amount <= 0) {
      alert("Enter a valid withdrawal amount.");
      return;
    }

    if (!method || !details) {
      alert("Please complete all withdrawal details.");
      return;
    }

    if ((loggedInUser.balance || 0) < amount) {
      alert("Insufficient balance for this withdrawal.");
      return;
    }

    const withdrawalRequest = {
      amount: amount,
      method: method,
      details: details,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    // Deduct balance
    loggedInUser.balance = Number(loggedInUser.balance || 0) - amount;

    // Save withdrawal
    if (!loggedInUser.withdrawals) {
      loggedInUser.withdrawals = [];
    }
    loggedInUser.withdrawals.unshift(withdrawalRequest);

    // Update logged in user
    localStorage.setItem("ukwh_logged_in_user", JSON.stringify(loggedInUser));

    // Update users array
    const updatedUsers = users.map(user => {
      if (user.email === loggedInUser.email) {
        return loggedInUser;
      }
      return user;
    });

    localStorage.setItem("ukwh_users", JSON.stringify(updatedUsers));

    alert("Withdrawal request submitted successfully!");
    window.location.href = "dashboard.html";
  });
}

/* -------------------------
   COPY REFERRAL LINK
-------------------------- */
function copyReferralLink() {
  const linkBox = document.getElementById("userReferralLink");
  if (!linkBox) return;

  const link = linkBox.textContent;
  navigator.clipboard.writeText(link)
    .then(() => alert("Referral link copied!"))
    .catch(() => alert("Unable to copy referral link."));
}

/* -------------------------
   LOGOUT
-------------------------- */
function logoutUser() {
  localStorage.removeItem("ukwh_logged_in_user");
  alert("Logged out successfully.");
  window.location.href = "login.html";
}

/* -------------------------
   RUN PAGE LOGIC
-------------------------- */
window.addEventListener("DOMContentLoaded", loadDashboard);
