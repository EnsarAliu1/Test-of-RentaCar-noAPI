let klinetetTABELA = "";

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

const clients = db.clients || [];
clients.forEach((client) => {
      klinetetTABELA += `
            <tr>
                <td>${client.id}</td>
                <td>${client.emri}</td>
                <td>${client.mbiemri}</td>
                <td>${client.email}</td>
                <td>${client.telefoni}</td>
                <td>${client.username}</td>
                <td>
                    <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 klientEdit" data-id="${client.id}">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 klientDelete" data-id="${client.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    document.getElementById("klientTabela").innerHTML = klinetetTABELA;

/*edit klientet**********************************************/

document.addEventListener("click", (e) => {
  if (e.target.closest(".klientEdit")) {
    const row = e.target.closest("tr");
    const id = e.target.closest(".klientEdit").dataset.id;
    const cells = row.querySelectorAll("td");

    const originals = {
      emri: cells[1].textContent,
      mbiemri: cells[2].textContent,
      email: cells[3].textContent,
      telefoni: cells[4].textContent,
      username: cells[5].textContent,
    };
    row.dataset.originals = JSON.stringify(originals);

    cells[1].innerHTML = `<input style="width:100%" value="${originals.emri}">`;
    cells[2].innerHTML = `<input style="width:100%" value="${originals.mbiemri}">`;
    cells[3].innerHTML = `<input style="width:100%" value="${originals.email}">`;
    cells[4].innerHTML = `<input style="width:100%" value="${originals.telefoni}">`;
    cells[5].innerHTML = `<input style="width:100%" value="${originals.username}">`;

    cells[6].innerHTML = `
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
      emri: cells[1].querySelectorAll("input").value,
      mbiemri: cells[2].querySelector("input").value,
      email: cells[3].querySelector("input").value,
      telefoni: cells[4].querySelector("input").value,
      username: cells[5].querySelector("input").value,
    };

    if (db.clients) {
      const idx = db.clients.findIndex(c => String(c.id) === String(id));
      if (idx !== -1) {
         db.clients[idx] = { ...db.clients[idx], ...updated };
         saveDb(db);
      }
    }
      cells[1].textContent = updated.emri;
      cells[2].textContent = updated.mbiemri;
      cells[3].textContent = updated.email;
      cells[4].textContent = updated.telefoni;
      cells[5].textContent = updated.username;

      cells[6].innerHTML = `
        <button class="editBtn" data-id="${id}">Edit</button>
        <button class="klientDelete" data-id="${id}">Delete</button>
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
    cells[2].textContent = originals.mbiemri;
    cells[3].textContent = originals.email;
    cells[4].textContent = originals.telefoni;
    cells[5].textContent = originals.username;

    cells[7].innerHTML = `
      <button class="py-1 px-2 text-dark bg-info border-0 rounded-2 mx-1 klientEdit" data-id="${id}"><i class="bi bi-pencil-square"></i></button>
      <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 klientDelete" data-id="${id}"><i class="bi bi-trash-fill"></i></button>
    `;
  }
});
/**********************************************/
document.addEventListener("click", function (e) {
  if (e.target.closest(".klientDelete")) {
    const btn = e.target.closest(".klientDelete");
    const row = btn.closest("tr");
    const id = btn.dataset.id;

    const konfirm = confirm("A je i sigurte qe do me fshi kete klient?");
    if (!konfirm) return;

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        message: "Klienti u fshi!",
        type: "success",
      }),
    );

    if (db.clients) {
       db.clients = db.clients.filter(c => String(c.id) !== String(id));
       saveDb(db);
       row.remove();
    }
  }
});
