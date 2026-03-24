const parametrat = new URLSearchParams(window.location.search);
const automjetiId = parametrat.get("automjetiId");

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

const automjetet = db.automjetet || [];
const automjeti = automjetet.find(a => String(a.id) === String(automjetiId));

if (automjeti) {
    let automjetiHTML = `
        <div class="card">
            <div class="card-img">
                <img class="w-100 h-100 rounded-top-2" src="../${automjeti.img}" alt="">
            </div>
            <div class="card-body">
                <div class="row justify-content-between align-content-center ">
                    <div class="col text-start">
                        <p class="card-title fw-bold ">${automjeti.emri}</p>
                        <p class="text-pharagraph">${automjeti.viti}</p>
                    </div>

                </div>
                <hr>
                <div class="row text-pharagraph">
                    <div class="col">
                        <p><i class="bi bi-fuel-pump"></i> ${automjeti.karburanti}</p>
                    </div>
                    <div class="col">
                        <p><i class="bi bi-gear"></i> ${automjeti.transmisioni}</p>
                    </div>
                    <div class="col">
                        <p><i class="bi bi-people"></i> ${automjeti.kapaciteti} vende</p>
                    </div>
                </div>
                <hr>
                <div class="row d-flex justify-content-between align-content-center  text-pharagraph">
                    <div class="col text-start">
                        <p>Cmimi ditor</p>
                    </div>
                    <div class="col text-end">
                        <p class="text-primary fs-4">€${automjeti.cmimi}</p>
                    </div>
                </div>
            </div>
        </div>            
      `;
    document.getElementById("automjeti-container").innerHTML = automjetiHTML;

    const rezervimiForm = document.getElementById("rezervimiForm");

    const onCreateReservation = (event) => {
      event.preventDefault();
      const dataeFillimit = document.getElementById("dataeFillimit").value;
      const dataeMbarimit = document.getElementById("dataeMbarimit").value;
      const shenime = document.getElementById("shenime").value;

      const username = localStorage.getItem("username");
      const clinetId = localStorage.getItem("clientId");

      if (dataeFillimit === "" || dataeMbarimit === "") {
        showToast(
          "Ju lutem zgjedhni datat per fillim dhe mbarim te rezervimit! ",
          "error",
        );
        return;
      } else if (username === null) {
        showToast("Duhet te beheni login per te rezervuar", "error");
        return;
      }

      const newReservation = {
        automjetiId: automjetiId,
        clientId: clinetId,
        username: username,
        dataMarrjes: dataeFillimit,
        dataKthimit: dataeMbarimit,
        shenime: shenime,
      };

      sessionStorage.setItem(
        "pendingToast",
        JSON.stringify({
          message: "Rezervimi u be me sukses!",
          type: "success",
        }),
      );

      newReservation.id = Math.random().toString(16).slice(2, 6);
      if (!db.rezervimet) db.rezervimet = [];
      db.rezervimet.push(newReservation);
      saveDb(db);
      
      rezervimiForm.reset();
    };

    rezervimiForm.addEventListener("submit", onCreateReservation);
}
