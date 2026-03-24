let mesazhetTABELA = "";

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

const mesazhet = db.mesazhet || [];
mesazhet.forEach((mesazhi) => {
      mesazhetTABELA += `
            <tr>
                <td>${mesazhi.id}</td>
                <td>${mesazhi.emriPlote}</td>
                <td>${mesazhi.email}</td>
                <td>${mesazhi.telefoni}</td>
                <td>${mesazhi.subjekti}</td>
                <td>${mesazhi.Mesazhi}</td>
                <td>
                    <button class="py-1 px-2 text-white bg-danger border-0 rounded-2 mx-1 mesazhDelete" data-id="${mesazhi.id}">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    document.getElementById("mesazhetTabela").innerHTML = mesazhetTABELA;

document.addEventListener("click", function (e) {
  if (e.target.closest(".mesazhDelete")) {
    const btn = e.target.closest(".mesazhDelete");
    const row = btn.closest("tr");
    const id = btn.dataset.id;

    const konfirm = confirm("A je i sigurt qe don me fshi kete mesazh?");
    if (!konfirm) return;

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        message: "Mesazhi u fshi",
        type: "success",
      }),
    );

    if (db.mesazhet) {
       db.mesazhet = db.mesazhet.filter(m => String(m.id) !== String(id));
       saveDb(db);
       row.remove();
    }
  }
});
