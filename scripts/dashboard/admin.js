
document.addEventListener("DOMContentLoaded", () => {
  const adminUsername = localStorage.getItem("adminUsername");
  const adminId = localStorage.getItem("adminId");

  if (adminUsername) {
    document.getElementById("adminUser").innerHTML =
      `<span class = "text-primary fw-bold fs-5 m-2"><i class="bi bi-person-circle"></i> ${adminUsername}</span>`;
    document.getElementById("logOut").innerHTML =
      `<button class="btn bg-danger text-dark fw-bold rounded-3 py-2 m-2" onclick="logout()">Log out</button>`;
  }
});

function logout() {
  localStorage.removeItem("adminUsername");
  localStorage.removeItem("adminId");
  window.location.href = "../../index.html";
}
