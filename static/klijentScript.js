function init(){
    fetch('http://127.0.0.1:8080/api/klijenti/all')
        .then(response => response.json())
        .then(data => {
            updateList(data);
        });
}

function updateList(data){
    var tabela = document.getElementById("klijenti");
    tabela.innerHTML = "";
    for(i in data){
        let redHTML = `<tr>
            <td>`+data[i].klijentId+`</td>
            <td>`+data[i].ime+`</td>
            <td>`+data[i].prezime+`</td>
            <td>`+data[i].email+`</td>
            </tr>`;
        tabela.innerHTML += redHTML;
    }
}