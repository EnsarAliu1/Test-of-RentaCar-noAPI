let automjetetHTML = "";

const automjetet = db.automjetet;
const automjetetIndex = automjetet.slice(0, 6);
automjetetIndex.forEach((automjeti) => {
  automjetetHTML += `
        <div class="col-md-4 mb-4 mx-auto">
                <div class="card">
                    <div class="card-img">
                        <img class="w-100 h-100 rounded-top-2" src="${automjeti.img.replace('../images/', './images/')}" alt="">
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
                        <div class="row">
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
document.getElementById("automjetet-container").innerHTML = automjetetHTML;

function rezervimi(automjetiId) {
  window.location.href = `rezervimi.html?automjetiId=${automjetiId}`;
}
