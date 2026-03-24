let teGjithaAutomjetet = db.automjetet || [];
shfaqAutomjetet(teGjithaAutomjetet);

/*filter me search*/
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {
  const vleraeInputit = searchInput.value.toLowerCase();

  const rezultatet = teGjithaAutomjetet.filter((automjeti) => {
    return (
      automjeti.emri.toLowerCase().includes(vleraeInputit) ||
      automjeti.viti.toString().includes(vleraeInputit) ||
      automjeti.karburanti.toLowerCase().includes(vleraeInputit) ||
      automjeti.transmisioni.toLowerCase().includes(vleraeInputit) ||
      automjeti.kapaciteti.toString().includes(vleraeInputit)
    );
  });

  shfaqAutomjetet(rezultatet);
});
/******************************************/

/*filter me select karburanti*/
const zgjidhKarburantin = document.getElementById("zgjidhKarburantin");

zgjidhKarburantin.addEventListener("change", () => {
  const karburanti = zgjidhKarburantin.value;

  if (karburanti === "") {
    shfaqAutomjetet(teGjithaAutomjetet);
  } else {
    const karburantiFiltruar = teGjithaAutomjetet.filter(
      (automjetet) => automjetet.karburanti === karburanti,
    );

    shfaqAutomjetet(karburantiFiltruar);
  }
});
/*******************************************/

/*filter me select transmisioni*/
const zgjidhTransmisionin = document.getElementById("zgjidhTransmisionin");
zgjidhTransmisionin.addEventListener("change", () => {
  const transmisioni = zgjidhTransmisionin.value;

  if (transmisioni === "") {
    shfaqAutomjetet(teGjithaAutomjetet);
  } else {
    const transmisioniFiltruar = teGjithaAutomjetet.filter(
      (automjetet) => automjetet.transmisioni === transmisioni,
    );
    shfaqAutomjetet(transmisioniFiltruar);
  }
});
/***************************************/

/*pastrimi i filterave*/
const pastroFiltrat = document.getElementById("pastroFiltrat");
pastroFiltrat.addEventListener("click", () => {
  searchInput.value = "";
  zgjidhKarburantin.value = "";
  zgjidhTransmisionin.value = "";
  shfaqAutomjetet(teGjithaAutomjetet);
});
/****************************************/

const shfaqAutomjetet = (lista) => {
  let listaHTML = "";

  lista.forEach((automjeti) => {
    listaHTML += `
            <div class="col-md-4 mb-4 mx-auto">
                <div class="card">
                    <div class="card-img">
                        <img class="w-100 h-100 rounded-top-2" src="${automjeti.img}" alt="">
                    </div>
                    <div class="card-body">
                        <div class="row justify-content-between align-content-center ">
                            <div class="col text-start">
                                <p class="card-title fw-bold ">${automjeti.emri}</p>
                                <p class="text-pharagraph">${automjeti.viti}</p>
                            </div>
                            <div class="col text-end">
                                <p class="text-primary fw-bold mb-1 fs-5">${automjeti.cmimi}</p>
                                <p class="text-pharagraph ">/ditë</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row text-pharagraph">
                            <div class="col">
                                <p><i class="bi bi-fuel-pump"></i>${automjeti.karburanti}</p>
                            </div>
                            <div class="col">
                                <p><i class="bi bi-gear"></i>${automjeti.transmisioni}</p>
                            </div>
                            <div class="col text-end">
                                <p><i class="bi bi-people "></i>${automjeti.kapaciteti}</p>
                            </div>
                        </div>
                        <hr>
                        <div class="row text-center">
                            <div class="col">
                                <button class="btn bg-primary text-dark fw-bold rounded-3 py-2 px-2"
                                    onclick="rezervimi(${automjeti.id})"><i
                                        class="bi bi-calendar"></i>Rezervo tani</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });
  if (lista.length === 0) {
    listaHTML = "<p class='text-center'>Nuk u gjet asnjë makinë</p>";
  }
  document.getElementById("automjetet-container").innerHTML = listaHTML;
};

function rezervimi(automjetiId) {
  window.location.href = `rezervimi.html?automjetiId=${automjetiId}`;
}
