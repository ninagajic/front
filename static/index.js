function init(){
    fetch('http://127.0.0.1:8080/api/usluge/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateList(data);
        });
}

function updateList(data) {
    var servicesContainer = document.getElementById("servicesContainer");
    servicesContainer.innerHTML = "";

    data.forEach(usluga => {
        var card = document.createElement("div");
        card.classList.add("col-sm-4");


        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <img src="${usluga.imgUrl}" class="card-img-top" alt="${usluga.naziv}}>
                    <h5 class="card-title">${usluga.naziv}</h5>
                    <p class="card-text">Opis : ${usluga.opis}</p>
                    <p class="card-text">Cena : ${usluga.cena}</p>
                    <p class="card-text">Kapacitet : ${usluga.kapacitet}</p>
                    <a href="rezervacija.html" class="btn btn-primary" style="background-color: #F07A85; border: none; font-weight: 600;">Rezervisi termin</a>
                </div>
            </div>`;

        servicesContainer.appendChild(card);
    });
}