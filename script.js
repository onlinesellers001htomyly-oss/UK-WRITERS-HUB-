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

    let users = getUsers();

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

    // $3 referral bonus
    if (referralCode) {
      const refOwnerIndex = users.findIndex(u => u.referralCode === referralCode);
      if (refOwnerIndex !== -1) {
        users[refOwnerIndex].referralEarnings =
          Number(users[refOwnerIndex].referralEarnings || 0) + 3;
      }
    }

    saveUsers(users);

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

    const users = getUsers();

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    saveLoggedInUser(user);

    alert("Login successful!");
    window.location.href = "dashboard.html";
  });
}

/* -------------------------
   LOGIN GUARD
-------------------------- */
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
   SYNC LOGGED USER FROM USERS ARRAY
-------------------------- */
function syncLoggedInUserFromUsers() {
  const loggedInUser = getLoggedInUser();
  if (!loggedInUser) return null;

  const users = getUsers();
  const freshUser = users.find(u => u.email === loggedInUser.email);

  if (freshUser) {
    saveLoggedInUser(freshUser);
    return freshUser;
  }

  return loggedInUser;
}

/* -------------------------
   DASHBOARD LOADER
-------------------------- */
function loadDashboard() {
  const welcomeName = document.getElementById("welcomeName");
  if (!welcomeName) return;

  const loggedInUser = syncLoggedInUserFromUsers() || requireLogin();
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

    let loggedInUser = syncLoggedInUserFromUsers() || requireLogin();
    if (!loggedInUser) return;

    const amount = parseFloat(document.getElementById("withdrawAmount").value);
    const method = document.getElementById("withdrawMethod").value;
    const details = document.getElementById("withdrawDetails").value.trim();

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
      id: Date.now(),
      amount,
      method,
      details,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    loggedInUser.balance = Number(loggedInUser.balance || 0) - amount;

    if (!loggedInUser.withdrawals) {
      loggedInUser.withdrawals = [];
    }

    loggedInUser.withdrawals.unshift(withdrawalRequest);

    const users = getUsers().map(user => {
      if (user.email === loggedInUser.email) return loggedInUser;
      return user;
    });

    saveUsers(users);
    saveLoggedInUser(loggedInUser);

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

  const loggedInUser = syncLoggedInUserFromUsers() || requireLogin();
  if (!loggedInUser) return;

  const users = getUsers();

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
   ADMIN PANEL LOADER
-------------------------- */
function loadAdminPanel() {
  const adminUsersTable = document.getElementById("adminUsersTable");
  if (!adminUsersTable) return;

  const users = getUsers();

  // Summary counts
  document.getElementById("adminTotalUsers").textContent = users.length;
  document.getElementById("adminActiveUsers").textContent = users.filter(u => u.active).length;

  const allWithdrawals = [];
  users.forEach(user => {
    (user.withdrawals || []).forEach(w => {
      allWithdrawals.push({
        ...w,
        userName: user.fullName,
        userEmail: user.email
      });
    });
  });

  const pendingCount = allWithdrawals.filter(w => w.status === "Pending").length;
  document.getElementById("adminPendingWithdrawals").textContent = pendingCount;

  // Users table
  if (!users.length) {
    adminUsersTable.innerHTML = `<tr><td colspan="9">No users found.</td></tr>`;
  } else {
    adminUsersTable.innerHTML = users.map(user => `
      <tr>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>${user.referralCode || "-"}</td>
        <td>${user.referredBy || "None"}</td>
        <td>$${Number(user.balance || 0).toFixed(2)}</td>
        <td>$${Number(user.referralEarnings || 0).toFixed(2)}</td>
        <td>
          <span class="status-badge ${user.active ? 'status-active' : 'status-inactive'}">
            ${user.active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          <div class="admin-action-group">
            <button class="admin-btn activate" onclick="activateUser('${user.email}')">
              Activate
            </button>
            <button class="admin-btn credit" onclick="creditUser('${user.email}')">
              Credit Balance
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  // Withdrawals table
  const adminWithdrawalsTable = document.getElementById("adminWithdrawalsTable");

  if (!allWithdrawals.length) {
    adminWithdrawalsTable.innerHTML = `<tr><td colspan="8">No withdrawal requests found.</td></tr>`;
  } else {
    adminWithdrawalsTable.innerHTML = allWithdrawals.map(w => `
      <tr>
        <td>${w.userName}</td>
        <td>${w.userEmail}</td>
        <td>$${Number(w.amount).toFixed(2)}</td>
        <td>${w.method}</td>
        <td>${w.details}</td>
        <td>
          <span class="status-badge ${
            w.status === 'Approved' ? 'status-approved' :
            w.status === 'Rejected' ? 'status-rejected' :
            'status-pending'
          }">
            ${w.status}
          </span>
        </td>
        <td>${w.date}</td>
        <td>
          <div class="admin-action-group">
            <button class="admin-btn approve" onclick="approveWithdrawal(${w.id}, '${w.userEmail}')">
              Approve
            </button>
            <button class="admin-btn reject" onclick="rejectWithdrawal(${w.id}, '${w.userEmail}')">
              Reject
            </button>
          </div>
        </td>
      </tr>
    `).join("");
  }
}

/* -------------------------
   ADMIN ACTIONS
-------------------------- */
function activateUser(email) {
  const users = getUsers().map(user => {
    if (user.email === email) {
      user.active = true;
      user.joinFeePaid = true;
    }
    return user;
  });

  saveUsers(users);

  const loggedInUser = getLoggedInUser();
  if (loggedInUser && loggedInUser.email === email) {
    const updated = users.find(u => u.email === email);
    saveLoggedInUser(updated);
  }

  alert("User activated successfully.");
  loadAdminPanel();
}

function creditUser(email) {
  const amountText = prompt("Enter amount to credit:");
  if (!amountText) return;

  const amount = parseFloat(amountText);
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount.");
    return;
  }

  const users = getUsers().map(user => {
    if (user.email === email) {
      user.balance = Number(user.balance || 0) + amount;
    }
    return user;
  });

  saveUsers(users);

  const loggedInUser = getLoggedInUser();
  if (loggedInUser && loggedInUser.email === email) {
    const updated = users.find(u => u.email === email);
    saveLoggedInUser(updated);
  }

  alert(`User credited with $${amount.toFixed(2)} successfully.`);
  loadAdminPanel();
}

function approveWithdrawal(withdrawalId, userEmail) {
  const users = getUsers().map(user => {
    if (user.email === userEmail) {
      user.withdrawals = (user.withdrawals || []).map(w => {
        if (w.id === withdrawalId) {
          w.status = "Approved";
        }
        return w;
      });
    }
    return user;
  });

  saveUsers(users);

  const loggedInUser = getLoggedInUser();
  if (loggedInUser && loggedInUser.email === userEmail) {
    const updated = users.find(u => u.email === userEmail);
    saveLoggedInUser(updated);
  }

  alert("Withdrawal approved.");
  loadAdminPanel();
}

function rejectWithdrawal(withdrawalId, userEmail) {
  const users = getUsers().map(user => {
    if (user.email === userEmail) {
      user.withdrawals = (user.withdrawals || []).map(w => {
        if (w.id === withdrawalId && w.status !== "Rejected") {
          w.status = "Rejected";
          user.balance = Number(user.balance || 0) + Number(w.amount || 0);
        }
        return w;
      });
    }
    return user;
  });

  saveUsers(users);

  const loggedInUser = getLoggedInUser();
  if (loggedInUser && loggedInUser.email === userEmail) {
    const updated = users.find(u => u.email === userEmail);
    saveLoggedInUser(updated);
  }

  alert("Withdrawal rejected and balance refunded.");
  loadAdminPanel();
}

/* -------------------------
   COPY REFERRAL LINKS
-------------------------- */
function copyReferralLink() {
  const linkBox = document.getElementById("userReferralLink");
  if (!linkBox) return;

  navigator.clipboard.writeText(linkBox.textContent)
    .then(() => alert("Referral link copied!"))
    .catch(() => alert("Unable to copy referral link."));
}

function copyReferralLinkFromPage() {
  const linkBox = document.getElementById("refPageLink");
  if (!linkBox) return;

  navigator.clipboard.writeText(linkBox.textContent)
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
  loadAdminPanel();
});
