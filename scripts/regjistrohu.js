

const form = document.getElementById("regjistrimForm");

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

const onClientCreate = (event) => {
  event.preventDefault();
  const emri = document.getElementById("emri").value;
  const mbiemri = document.getElementById("mbiemri").value;
  const email = document.getElementById("email").value;
  const telefoni = document.getElementById("telefoni").value;
  const password = document.getElementById("password").value;
  const konfirmo = document.getElementById("konfirmo").value;

  if (
    emri === "" ||
    mbiemri === "" ||
    email === "" ||
    telefoni === "" ||
    password === "" ||
    konfirmo === ""
  ) {
    showToast("Ju lutem plotesoni te gjitha fushat!", "error");
    return;
  }

  if (password.length < 8) {
    showToast("Fjalekalimi duhet te kete te pakten 8 karaktere!", "error");
    return;
  }

  if (password !== konfirmo) {
    showToast("Fjalekalimi dhe konfirmi duhet te jene te njejta!", "error");
    return;
  }

  if (!email.includes("@")) {
    showToast("Emaili duhet te jete ne formatin e duhur!", "error");
    return;
  }

  const ekzistonEmail = db.clients && db.clients.some(c => c.email === email);
  if (ekzistonEmail) {
    showToast(
      "Ky email eshte i perdorur, ju lutem zgjidhni nje email tjeter!",
      "error",
    );
    return;
  }

  const ekzistonTelefoni = db.clients && db.clients.some(c => c.telefoni === telefoni);
  if (ekzistonTelefoni) {
    showToast(
      "Ky numer telefoni eshte i perdorur, ju lutem zgjidhni nje numer tjeter!",
      "error",
    );
    return;
  }

  const newClient = {
    emri: emri,
    mbiemri: mbiemri,
    email: email,
    telefoni: telefoni,
    password: password,
    username: emri + mbiemri.toLowerCase(),
  };

  // Ruaj toast mesazhin para se te bejme POST (sepse Live Server bon reload kur ndryshon db.json)
  sessionStorage.setItem(
    "pendingToast",
    JSON.stringify({
      message: "Llogaria u krijua me sukses!",
      type: "success",
      redirect: "./hyr.html",
    }),
  );

  newClient.id = Math.random().toString(16).slice(2, 6);
  if (!db.clients) db.clients = [];
  db.clients.push(newClient);
  saveDb(db);
  
  form.reset();
  window.location.href = "./hyr.html";
};

form.addEventListener("submit", onClientCreate);
