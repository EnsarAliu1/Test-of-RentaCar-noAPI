
const kontaktForm = document.getElementById("kontaktForm");

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

const onSendMessage = (event) => {
  event.preventDefault();
  const emriPlote = document.getElementById("emriPlote").value;
  const email = document.getElementById("email").value;
  const telefoni = document.getElementById("telefoni").value;
  const subjekti = document.getElementById("subjekti").value;
  const mesazhi = document.getElementById("mesazhi").value;

  if (
    emriPlote === "" ||
    email === "" ||
    telefoni === "" ||
    subjekti === "" ||
    mesazhi === ""
  ) {
    showToast("Ju lutem plotesoni fushat perkatese!", "error");
    return;
  } else if (!email.includes("@")) {
    showToast("Emaili duhet te jete ne formen e duhur!", "error");
    return;
  } else if (!telefoni.startsWith("+")) {
    showToast("Numri i telefonit duhet te jet ne formatin e duhur!", "error");
    return;
  }

  const newMessage = {
    emriPlote: emriPlote,
    email: email,
    telefoni: telefoni,
    subjekti: subjekti,
    Mesazhi: mesazhi,
  };

  sessionStorage.setItem(
    "pendingToast",
    JSON.stringify({
      message: "Mesazhi u dergua me sukses!",
      type: "success",
    }),
  );

  newMessage.id = Math.random().toString(16).slice(2, 6);
  if (!db.mesazhet) db.mesazhet = [];
  db.mesazhet.push(newMessage);
  saveDb(db);
  kontaktForm.reset();
};

kontaktForm.addEventListener("submit", onSendMessage);
