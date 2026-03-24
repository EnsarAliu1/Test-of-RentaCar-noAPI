const form = document.getElementById("adminForm");

function showToast(message, type) {
  const toastElement = document.getElementById("pageToast");
  const toastText = document.getElementById("toastText");

  toastText.textContent = message;

  toastElement.classList.remove("text-bg-success", "text-bg-danger");

  if (type === "success") {
    toastElement.classList.add("text-bg-success");
  } else if (type === "error") {
    toastElement.classList.add("text-bg-danger");
  }

  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

window.addEventListener("DOMContentLoaded", () => {
  const pendingToast = sessionStorage.getItem("pendingToast");
  if (pendingToast) {
    const { message, type } = JSON.parse(pendingToast);
    sessionStorage.removeItem("pendingToast");
    showToast(message, type);
  }
});

const onAdminLogin = (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "" || password === "") {
    showToast("Ju lutem plotesoni username dhe fjalekalimin!", "error");
    return;
  }

  const admins = db.admins || [];
  const admin = admins.find(
    (a) => a.username === username && a.password === password,
  );

      if (!admin) {
        showToast("Username ose fjalkalimi eshte i gabuar!", "error");
        return;
      }

      localStorage.setItem("adminUsername", admin.username);
      localStorage.setItem("adminId", admin.id);

      showToast("Hyrja u krye me sukses!", "success");
      setTimeout(() => {
        window.location.href = "../../views/dashboard/admindashboard.html";
      }, 1500);
};

form.addEventListener("submit", onAdminLogin);
