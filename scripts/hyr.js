const form = document.getElementById("hyrForm");

window.addEventListener("DOMContentLoaded", () => {
  const pendingToast = sessionStorage.getItem("pendingToast");
  if (pendingToast) {
    const { message, type } = JSON.parse(pendingToast);
    sessionStorage.removeItem("pendingToast");
    showToast(message, type);
  }
});

function showToast(message, type) {
  const toastElement = document.getElementById("loginToast");
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

const onClientLogin = (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (email === "" || password === "") {
    showToast("Ju lutem plotesoni email dhe fjalekalimin!", "error");
    return;
  }

  const clients = db.clients || [];
  const client = clients.find(
    (c) => c.email === email && c.password === password,
  );

      if (!client) {
        showToast("Emaili ose fjalekalimi eshte i gabuar!", "error");
        return;
      }

      localStorage.setItem("username", client.username);
      localStorage.setItem("clientId", client.id);

      const toastElement = document.getElementById("loginToast");
      const toast = new bootstrap.Toast(toastElement);
      let toastText = document.getElementById("toastText");
      toastText.textContent = "Hyrja u krye me sukses";

      showToast("Hyrja u krye me sukses!", "success");

      setTimeout(() => {
        window.location.href = "../index.html";
      }, 1500);
};

form.addEventListener("submit", onClientLogin);
