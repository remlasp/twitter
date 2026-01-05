const btn = document.querySelector("button");
const input = document.getElementById("username");
const result = document.getElementById("result");

async function search() {
  const username = input.value.trim();

  clearUI();

  // Input validation
  if (!username) {
    showError("Username cannot be empty.");
    return;
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showError("Invalid username format.");
    return;
  }

  // Disable UI
  btn.disabled = true;
  btn.innerText = "Searching...";
  result.innerHTML = '<div class="loader">Contacting server...</div>';

  try {
    const res = await fetch(`/user/${username}`);

    // Rate limit handling
    if (res.status === 429) {
      showError("Too many requests. Please wait and try again.");
      return;
    }

    const json = await res.json();

    if (!json.data) {
      showError("User not found.");
      return;
    }

    // DOM rendering
    displayUser(json.data);

  } catch (err) {
    showError("Connection error. Please try again.");
  } finally {
    btn.disabled = false;
    btn.innerText = "Search";
  }
}

/* =========================
   DOM FUNCTIONS
========================= */

function displayUser(user) {
  result.innerHTML = `
    <div class="user-card">
      <img src="${user.profile_image_url}" class="profile-img" alt="Profile">
      <h3 class="user-name">${user.name}</h3>
      <p class="user-handle">@${user.username}</p>
      <p class="user-bio">${user.description || "No bio available"}</p>
      <small class="user-id">User ID: ${user.id}</small>
    </div>
  `;
}

function showError(message) {
  result.innerHTML = `<p class="error-msg">⚠️ ${message}</p>`;
}

function clearUI() {
  result.innerHTML = "";
}
const cors = require('cors');
app.use(cors({
  origin: 'https://remlasp.github.io' 
}));
