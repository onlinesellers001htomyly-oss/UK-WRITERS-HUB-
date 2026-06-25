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

/* -------------------------
   REGISTER USER
-------------------------- */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  // Auto-fill referral code from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get("ref");
  const referralInput = document.getElementById("referralCode");
  if (referralInput && refFromUrl) {
    referralInput.value = refFromUrl;
  }

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
      withdrawals: [],
      createdAt: new Date().toLocaleString()
    };

    users.push(newUser);

    // OPTIONAL TEST REFERRAL BONUS LOGIC
    // If someone registered using a valid referral code,
    // credit the owner of that code.
    if (referralCode) {
      const refOwnerIndex = users.findIndex(u => u.referralCode === referralCode);
      if (refOwnerIndex !== -1) {
        users[refOwnerIndex].referralEarnings = Number(users[refOwnerIndex].referralEarnings || 0) + 1;
      }
    }

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
   GET LOGGED IN USER
-------------------------- */
function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("ukwh_logged_in_user"));
}

function requireLogin() {
  const user = getLoggedInUser();
  if (!user) {
    alert("You must login first.");
    window.location.href = "login.html";
    return null;
  }
  return user;
}

/* -------------------------
   DASHBOARD LOADER
-------------------------- */
function loadDashboard() {
  const welcomeName = document.getElementById("welcomeName");
  if (!welcomeName) return;

  const loggedInUser = requireLogin();
  if (!loggedInUser) return;

  document.getElementById("welcomeName").textContent = loggedInUser.fullName || "User";
  document.getElementById("userBalance").textContent = "$" + Number(loggedInUser.balance || 0).toFixed(2);
  document.getElementById("referralEarnings").textContent = "$" + Number(loggedInUser.referralEarnings || 0).toFixed(2);
  document.getElementById("accountStatus").textContent = loggedInUser.active ? "Active" : "Inactive";

  const referralLink = `${getBaseUrl()}?ref=${loggedInUser.referralCode}`;
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

    let loggedInUser = requireLogin();
    if (!loggedInUser) return;

    let users = JSON.parse(localStorage.getItem("ukwh_users")) || [];

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

    loggedInUser.balance = Number(loggedInUser.balance || 0) - amount;

    if (!loggedInUser.withdrawals) {
      loggedInUser.withdrawals = [];
    }
    loggedInUser.withdrawals.unshift(withdrawalRequest);

    localStorage.setItem("ukwh_logged_in_user", JSON.stringify(loggedInUser));

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
   REFERRALS PAGE LOADER
-------------------------- */
function loadReferralsPage() {
  const refPageCode = document.getElementById("refPageCode");
  if (!refPageCode) return;

  const loggedInUser = requireLogin();
  if (!loggedInUser) return;

  const users = JSON.parse(localStorage.getItem("ukwh_users")) || [];

  const referredUsers = users.filter(
    user => user.referredBy && user.referredBy === loggedInUser.referralCode
  );

  const referralLink = `${getBaseUrl()}?ref=${loggedInUser.referralCode}`;

  document.getElementById("refPageCode").textContent = loggedInUser.referralCode || "-";
  document.getElementById("refPageCount").textContent = referredUsers.length;
  document.getElementById("refPageEarnings").textContent =
    "$" + Number(loggedInUser.referralEarnings || 0).toFixed(2);
  document.getElementById("refPageLink").textContent = referralLink;

  const referredUsersList = document.getElementById("referredUsersList");

  if (!referredUsers.length) {
    referredUsersList.innerHTML = "<p>No referrals yet.</p>";
  } else {
    referredUsersList.innerHTML = referredUsers.map(user => `
      <div class="referred-user-item">
        <p><strong>Name:</strong> ${user.fullName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Joined:</strong> ${user.createdAt || "N/A"}</p>
      </div>
    `).join("");
  }
}

/* -------------------------
   COPY REFERRAL LINKS
-------------------------- */
function copyReferralLink() {
  const linkBox = document.getElementById("userReferralLink");
  if (!linkBox) return;

  const link = linkBox.textContent;
  navigator.clipboard.writeText(link)
    .then(() => alert("Referral link copied!"))
    .catch(() => alert("Unable to copy referral link."));
}

function copyReferralLinkFromPage() {
  const linkBox = document.getElementById("refPageLink");
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
window.addEventListener("DOMContentLoaded", function () {
  loadDashboard();
  loadReferralsPage();
});
