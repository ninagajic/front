function init() {
    document.getElementById("rezervacije").addEventListener("click",function(event) {
        event.preventDefault()

        var email = document.getElementById("email").value

        fetch('http://127.0.0.1:8080/api/rezervacije/byEmail?email=' + encodeURIComponent(email))
        .then(response => response.json())
        .then(data => {
            updateList(data);
        });
    });
   
    
    document.getElementById("rezervacijaForm").addEventListener("submit",function(event) {
        event.preventDefault()

        var email = document.getElementById("email2").value
        var ime = document.getElementById("ime").value;
        var prezime = document.getElementById("prezime").value;
        var uslugaNaziv = document.getElementById("usluga").value; 
        var datetimeValue = document.getElementById("termin").value;
        var kodPopust = document.getElementById("popust").value;

        var [dateValue, timeValue] = datetimeValue.split("T");
        var date = new Date(dateValue);
        var time = timeValue.substring(0, 5);

console.log("Usluga: " + uslugaNaziv);
        if (time.endsWith("00")) {
            fetch('http://127.0.0.1:8080/api/usluge/byNaziv?naziv=' + encodeURIComponent(uslugaNaziv))
            .then(response => response.json())
            .then(data => {
                fetch('http://127.0.0.1:8080/api/klijenti/byImeAndPrezime?ime=' + encodeURIComponent(ime) + '&prezime=' + encodeURIComponent(prezime))
                .then(response => response.json())
                .then(data2 => {
                let novaRezervacija = {
                    datum: date,
                    vreme: time,
                    kodPopust: kodPopust,
                    klijent: data2,
                    usluga: data,
                    token: ' '
                }
                nr = JSON.stringify(novaRezervacija);

                fetch('http://127.0.0.1:8080/api/rezervacije', 
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body:nr
                    })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else if (response.status === 403) {
                            alert("Molim vas izaberite neki drugi termin jer je sve zauzeto za izabrani termin.");
                        }else {
                            throw new Error('Došlo je do problema prilikom rezervacije.');
                        }
                    })
                    .then(data => {
                        fetch('http://127.0.0.1:8080/api/rezervacije/byEmail?email=' + encodeURIComponent(email))
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            updateList(data);
                        });
                    })
                    .catch(error => {
                        console.error('Greška:', error);
                        alert("Došlo je do greške prilikom rezervacije.");
                    });
                });
            });
        } else {
            alert("Molim Vas napišite pun sat");
        }
        document.getElementById("email2").value = '';
        document.getElementById("ime").value = '';
        document.getElementById("prezime").value = '';
        document.getElementById("usluga").value = '';
        document.getElementById("termin").value = '';
        document.getElementById("popust").value = '';
    });
}

function updateList(data) {
    var tabelaRezervacijaDiv = document.getElementById("tabelaRezervacija");

    var table = document.createElement("table");
    table.classList.add("table");

    var headerRow = document.createElement("tr");

    var headers = ["Klijent", "Datum", "Vreme", "Usluga", "Cena", "Detaljnije", ""]; 

    headers.forEach(function(headerText) {
        var headerCell = document.createElement("th");
        headerCell.textContent = headerText;
        headerRow.appendChild(headerCell);
    });

    table.appendChild(headerRow);

    var tbody = document.createElement("tbody");
    var totalCost = 0;
    data.forEach(function(rezervacija) {
        var row = document.createElement("tr");

        var cells = [
            rezervacija.klijent.email,
            rezervacija.datum,
            rezervacija.vreme,
            rezervacija.usluga.naziv,
            rezervacija.usluga.cena,
        ];

        cells.forEach(function(cellData) {
            var cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);
        });

        var detaljiCell = document.createElement("td");
        var detaljiButton = document.createElement("button");
        detaljiButton.textContent = "Detaljnije";
        detaljiButton.classList.add("btn", "btn-info");
        detaljiButton.addEventListener("click", function() {
            prikaziDetalje(rezervacija); 
        });
        detaljiCell.appendChild(detaljiButton);
        row.appendChild(detaljiCell); 

        var deleteCell = document.createElement("td");
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Otkazi rezervaciju";
        deleteButton.classList.add("btn", "btn-danger");
        deleteButton.addEventListener("click", function() {
            deleteRezervacija(rezervacija.rezervacijaID);
        });
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell); 

        tbody.appendChild(row);
        totalCost+= parseFloat(rezervacija.usluga.cena);
    });

    table.appendChild(tbody);
    var totalRow = document.createElement("tr");
    var totalCell = document.createElement("td");
    totalCell.colSpan = 5;
    totalCell.textContent = "Ukupno:";
    totalRow.appendChild(totalCell);

    var totalCostCell = document.createElement("td");
    totalCostCell.textContent = totalCost.toFixed(2); 
    totalRow.appendChild(totalCostCell);

    table.appendChild(totalRow);


    tabelaRezervacijaDiv.innerHTML = "";
    tabelaRezervacijaDiv.appendChild(table);
}

function prikaziDetalje(rezervacija) {
    fetch('http://127.0.0.1:8080/api/rezervacije/byEmailAndToken?email=' + encodeURIComponent(rezervacija.klijent.email)+"&token="+ encodeURIComponent(rezervacija.token))
        .then(response => response.json())
        .then(rez => {
            document.getElementById("detaljiKlijent").textContent = "Klijent: " + rez.klijent.email;
            document.getElementById("detaljiDatum").textContent = "Datum: " + rez.datum;
            document.getElementById("detaljiVreme").textContent = "Vreme: " + rez.vreme;
            document.getElementById("detaljiUsluga").textContent = "Usluga: " + rez.usluga.naziv;
            document.getElementById("detaljiCena").textContent = "Cena: " + rez.usluga.cena;
            document.getElementById("detaljiOpis").textContent="Opis izabrane usluge: "+rez.usluga.opis;
            document.getElementById("tokenDohvacen").textContent="Token: "+ rez.token;
            document.getElementById("detaljiRezervacije").style.display = "block";
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Došlo je do greške pri dohvatanju informacija o usluzi.");
        });
}



function createDeleteButton(reservationId) {
    var button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("btn", "btn-danger");
    button.addEventListener("click", function() {
        deleteRezervacija(reservationId);
    });
    return button;
}




function deleteRezervacija(id) {
    
    fetch('http://127.0.0.1:8080/api/rezervacije/' + encodeURIComponent(id))
    .then(response => response.json())
    .then(data => {
        var termin = new Date(data.datum);
        var danas = new Date();
        var razlika = Math.abs(termin.getTime() - danas.getTime());
        var razlikaDana = Math.ceil(razlika / (1000 * 3600 * 24));
        
        if (razlikaDana <= 2) {
            alert('Nije moguće otkazati rezervaciju jer je manje ili jednako od 2 dana do termina.');
            return;
        }

        fetch('http://127.0.0.1:8080/api/rezervacije/' + encodeURIComponent(id), { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                
                alert('Rezervacija otkazana');
            } else {
                alert('Nije uspelo brisanje');
            }
            return {};
        })
        .then(() => {
            fetch('http://127.0.0.1:8080/api/rezervacije/byEmail?email=' + encodeURIComponent(email))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                updateList(data)
            })
        });
    });
}






