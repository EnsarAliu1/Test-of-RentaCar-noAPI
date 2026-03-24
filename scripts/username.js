
document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  const clientId = localStorage.getItem("clientId");

  if (username) {
    document.getElementById("nav-user").innerHTML =
      `<span class = "text-primary fw-bold fs-5 m-2"><i class="bi bi-person-circle"></i> ${username}</span>`;
    document.getElementById("log-out").innerHTML =
      `<button class="btn bg-danger text-dark fw-bold rounded-3 py-2 m-2" onclick="logout()">Log out</button>`;
  }
});

function logout() {
  localStorage.removeItem("username");
  localStorage.removeItem("clientId");
  window.location.reload();
}
