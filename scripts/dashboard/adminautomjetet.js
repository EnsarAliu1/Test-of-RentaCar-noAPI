let automjetetTABELA = "";

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
automjetet.forEach((automjeti) => {
      automjetetTABELA += `
            <tr>
                <td>${automjeti.id}</td>
                <td>${automjeti.emri}</td>
                <td>${automjeti.viti}</td>
                <td>${automjeti.karburanti}</td>
                <td>${automjeti.transmisioni}</td>
                <td>${automjeti.kapaciteti}</td>
                <td>${automjeti.cmimi}</td>
                <td>
                    <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 autoEdit" data-id="${automjeti.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 autoDelete" data-id="${automjeti.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    document.getElementById("autoTabela").innerHTML = automjetetTABELA;

//shto automjet//
const autoForm = document.getElementById("autoForm");

autoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const autoEmri = document.getElementById("autoEmri").value;
  const autoViti = document.getElementById("autoViti").value;
  const autoKarburanti = document.getElementById("autoKarburanti").value;
  const autoTransmisioni = document.getElementById("autoTransmisioni").value;
  const autoKapaciteti = document.getElementById("autoKapaciteti").value;
  const autoImg = document.getElementById("autoImg").files[0];
  const autoCmimi = document.getElementById("autoCmimi").value;

  if (autoImg) {
    const reader = new FileReader();

    reader.onload = function () {
      const imgBase64 = reader.result;

      const newCar = {
        emri: autoEmri,
        viti: autoViti,
        karburanti: autoKarburanti,
        transmisioni: autoTransmisioni,
        kapaciteti: autoKapaciteti,
        cmimi: autoCmimi,
        img: imgBase64,
      };

      sessionStorage.setItem(
        "pendingToast",
        JSON.stringify({
          message: "Automjeti u shtua me sukses!",
          type: "success",
        }),
      );

      newCar.id = Math.random().toString(16).slice(2, 6);
      if (!db.automjetet) db.automjetet = [];
      db.automjetet.push(newCar);
      saveDb(db);

      autoForm.reset();

      const modalEl = document.getElementById("shtoAutomjet");
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
      window.location.reload();
    };

    reader.readAsDataURL(autoImg);
  }
});
/*********************************************/

//edit automjet*******************************************/
document.addEventListener("click", (e) => {
  if (e.target.closest(".autoEdit")) {
    const row = e.target.closest("tr");
    const id = e.target.closest(".autoEdit").dataset.id;
    const cells = row.querySelectorAll("td");

    const originals = {
      emri: cells[1].textContent,
      viti: cells[2].textContent,
      karburanti: cells[3].textContent,
      transmisioni: cells[4].textContent,
      kapaciteti: cells[5].textContent,
      cmimi: cells[6].textContent,
    };
    row.dataset.originals = JSON.stringify(originals);

    cells[1].innerHTML = `<input style="width:100%" value="${originals.emri}">`;
    cells[2].innerHTML = `<input style="width:100%" value="${originals.viti}">`;
    cells[3].innerHTML = `<input style="width:100%" value="${originals.karburanti}">`;
    cells[4].innerHTML = `<input style="width:100%" value="${originals.transmisioni}">`;
    cells[5].innerHTML = `<input style="width:100%" value="${originals.kapaciteti}">`;
    cells[6].innerHTML = `<input style="width:100%" value="${originals.cmimi}">`;

    cells[7].innerHTML = `
      <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 saveBtn" data-id="${id}">Save</button>
      <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 cancelBtn">Cancel</button>
    `;
  }

  //butoni per save
  if (e.target.classList.contains("saveBtn")) {
    const row = e.target.closest("tr");
    const id = e.target.dataset.id;
    const cells = row.querySelectorAll("td");

    const updated = {
      emri: cells[1].querySelector("input").value,
      viti: cells[2].querySelector("input").value,
      karburanti: cells[3].querySelector("input").value,
      transmisioni: cells[4].querySelector("input").value,
      kapaciteti: cells[5].querySelector("input").value,
      cmimi: cells[6].querySelector("input").value,
    };

    if (db.automjetet) {
      const idx = db.automjetet.findIndex(a => String(a.id) === String(id));
      if (idx !== -1) {
         db.automjetet[idx] = { ...db.automjetet[idx], ...updated };
         saveDb(db);
      }
    }
      cells[1].textContent = updated.emri;
      cells[2].textContent = updated.viti;
      cells[3].textContent = updated.karburanti;
      cells[4].textContent = updated.transmisioni;
      cells[5].textContent = updated.kapaciteti;
      cells[6].textContent = updated.cmimi;

      cells[7].innerHTML = `
        <button class="editBtn" data-id="${id}">Edit</button>
        <button class="autoDelete" data-id="${id}">Delete</button>
      `;

  }
  //butoni per cancel
  if (e.target.classList.contains("cancelBtn")) {
    const row = e.target.closest("tr");
    const cells = row.querySelectorAll("td");
    const originals = JSON.parse(row.dataset.originals);
    const id =
      row.querySelector(".saveBtn")?.dataset.id ||
      row.querySelector(".editBtn")?.dataset.id;

    cells[1].textContent = originals.emri;
    cells[2].textContent = originals.viti;
    cells[3].textContent = originals.karburanti;
    cells[4].textContent = originals.transmisioni;
    cells[5].textContent = originals.kapaciteti;
    cells[6].textContent = originals.cmimi;

    cells[7].innerHTML = `
      <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 autoEdit" data-id="${id}"><i class="bi bi-pencil-square"></i></button>
      <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 autoDelete" data-id="${id}"><i class="bi bi-trash-fill"></i></button>
    `;
  }
});
/********************************* */

document.addEventListener("click", function (e) {
  if (e.target.closest(".autoDelete")) {
    const btn = e.target.closest(".autoDelete");
    const row = btn.closest("tr");
    const id = btn.dataset.id;

    const konfirm = confirm("A je i sigurt qe don me fshi kete automjet?");
    if (!konfirm) return;

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        message: "Automjeti u fshi!",
        type: "success",
      }),
    );

    if (db.automjetet) {
       db.automjetet = db.automjetet.filter(a => String(a.id) !== String(id));
       saveDb(db);
       row.remove();
    }
  }
});
