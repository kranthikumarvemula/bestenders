// వెబ్‌సైట్ ఓపెన్ అవ్వగానే డేటాను లోడ్ చేయడం
document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    // ఆటోమేటిక్‌గా క్రియేట్ అయిన tenders.json ఫైల్ నుండి డేటా తెచ్చుకోవడం
    fetch('tenders.json')
        fetch('tenders.json')
        .then(data => {
            const tableBody = document.querySelector("#tenderTable tbody");
            tableBody.innerHTML = ""; // పాత డేటాను క్లియర్ చేయడం

            data.forEach(tender => {
                const row = `<tr>
                    <td>${tender.id}</td>
                    <td>${tender.category}</td>
                    <td>${tender.description}</td>
                    <td>${tender.value}</td>
                    <td>${tender.date}</td>
                    <td><a href="https://apeprocurement.gov.in" target="_blank" class="btn-download">అప్లై</a></td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error("డేటా లోడ్ చేయడంలో ఇబ్బంది వచ్చింది:", error);
        });
}

// సెర్చ్ ఫంక్షన్ (పాతదే)
function searchTenders() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("tenderTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td");
        if (td.length > 0) {
            let textValue = td[1].textContent + " " + td[2].textContent;
            if (textValue.toLowerCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}
