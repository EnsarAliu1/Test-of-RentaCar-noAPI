let rezervimetTABELA = "";

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

const rezervimet = db.rezervimet || [];
rezervimet.forEach((rezervimi) => {
      rezervimetTABELA += `
            <tr>
                <td>${rezervimi.id}</td>
                <td>${rezervimi.automjetiId}</td>
                <td>${rezervimi.clientId}</td>
                <td>${rezervimi.username}</td>
                <td>${rezervimi.dataMarrjes}</td>
                <td>${rezervimi.dataKthimit}</td>
                <td>${rezervimi.shenime}</td>
                <td>
                    <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 rezervimEdit" data-id="${rezervimi.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 rezervimDelete" data-id="${rezervimi.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    document.getElementById("rezervimiTabela").innerHTML = rezervimetTABELA;

//shto rezervim

const rezervimiForm = document.getElementById("rezervimiForm");

rezervimiForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const autoId = document.getElementById("autoId").value;
  const clientiId = document.getElementById("clientiId").value;
  const username = document.getElementById("username").value;
  const dataMarrjes = document.getElementById("dataMarrjes").value;
  const dataKthimit = document.getElementById("dataKthimit").value;
  const shenime = document.getElementById("shenime").value;

  const newReservation = {
    automjetiId: autoId,
    clientId: clientiId,
    username: username,
    dataMarrjes: dataMarrjes,
    dataKthimit: dataKthimit,
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

  const modalEl = document.getElementById("shtoRezervim");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
  window.location.reload();
});
/*************************************************/

/*edit rezervime* *******************************/
document.addEventListener("click", (e) => {
  if (e.target.closest(".rezervimEdit")) {
    const row = e.target.closest("tr");
    const id = e.target.closest(".rezervimEdit").dataset.id;
    const cells = row.querySelectorAll("td");

    const originals = {
      automjetiId: cells[1].textContent,
      clientId: cells[2].textContent,
      username: cells[3].textContent,
      dataMarrjes: cells[4].textContent,
      dataKthimit: cells[5].textContent,
      shenime: cells[6].textContent,
    };
    row.dataset.originals = JSON.stringify(originals);

    cells[1].innerHTML = `<input style="width:100%" value="${originals.automjetiId}">`;
    cells[2].innerHTML = `<input style="width:100%" value="${originals.clientId}">`;
    cells[3].innerHTML = `<input style="width:100%" value="${originals.username}">`;
    cells[4].innerHTML = `<input style="width:100%" value="${originals.dataMarrjes}">`;
    cells[5].innerHTML = `<input style="width:100%" value="${originals.dataKthimit}">`;
    cells[6].innerHTML = `<input style="width:100%" value="${originals.shenime}">`;

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
      automjetiId: cells[1].querySelector("input").value,
      clientId: cells[2].querySelector("input").value,
      username: cells[3].querySelector("input").value,
      dataMarrjes: cells[4].querySelector("input").value,
      dataKthimit: cells[5].querySelector("input").value,
      shenime: cells[6].querySelector("input").value,
    };

    if (db.rezervimet) {
      const idx = db.rezervimet.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
         db.rezervimet[idx] = { ...db.rezervimet[idx], ...updated };
         saveDb(db);
      }
    }
      cells[1].textContent = updated.automjetiId;
      cells[2].textContent = updated.clientId;
      cells[3].textContent = updated.username;
      cells[4].textContent = updated.dataMarrjes;
      cells[5].textContent = updated.dataKthimit;
      cells[6].textContent = updated.shenime;

      cells[7].innerHTML = `
        <button class="editBtn" data-id="${id}">Edit</button>
        <button class="autoDelete" data-id="${id}">Delete</button>
      `;

  }

  //butoni per cancel
  if (e.target.closest.contains("cancelBtn")) {
    const row = e.target.closest("tr");
    const cells = row.querySelectorAll("td");
    const originals = JSON.parse(row.dataset.originals);
    const id =
      row.querySelector(".saveBtn")?.dataset.id ||
      row.querySelector(".editBtn")?.dataset.id;

    cells[1].textContent = originals.automjetiId;
    cells[2].textContent = originals.clientId;
    cells[3].textContent = originals.username;
    cells[4].textContent = originals.dataMarrjes;
    cells[5].textContent = originals.dataKthimit;
    cells[6].textContent = originals.shenime;

    cells[7].innerHTML = `
      <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 rezervimEdit" data-id="${id}"><i class="bi bi-pencil-square"></i></button>
      <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 rezervimDelete" data-id="${id}"><i class="bi bi-trash-fill"></i></button>
    `;
  }
});

document.addEventListener("click", function (e) {
  if (e.target.closest(".rezervimDelete")) {
    const btn = e.target.closest(".rezervimDelete");
    const row = btn.closest("tr");
    const id = btn.dataset.id;

    const konfirm = confirm("A je i sigurt qe don me fshi kete rezervim?");
    if (!konfirm) return;

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        message: "Rezervimi o fshi!",
        type: "success",
      }),
    );

    if (db.rezervimet) {
       db.rezervimet = db.rezervimet.filter(r => String(r.id) !== String(id));
       saveDb(db);
       row.remove();
    }
  }
});
