let allTenders = [];
let showAll = false;

document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            allTenders = data;
            renderTable();
        })
        .catch(error => {
            console.error("డేటా లోడ్ చేయడంలో ఇబ్బంది వచ్చింది:", error);
        });
}

function renderTable() {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    // ఒకవేళ మోర్ నొక్కకపోతే మొదటి 5 చూపిస్తుంది, నొక్కితే అన్నీ (50+) చూపిస్తుంది
    const tendersToDisplay = showAll ? allTenders : allTenders.slice(0, 5);

    tendersToDisplay.forEach(tender => {
        const row = `<tr>
            <td><strong>${tender.deptName || 'AP eProcurement'}</strong></td>
            <td>${tender.id}</td>
            <td>${tender.noticeNo || 'NIT-' + tender.id}</td>
            <td>${tender.description}</td>
            <td>${tender.value}</td>
            <td>${tender.startDate || '01-08-2026 10:00 AM'}</td>
            <td>${tender.date || '25-08-2026 05:00 PM'}</td>
            <td><a href="https://tender.apeprocurement.gov.in/" target="_blank" class="btn-view"><i class="fa-solid fa-eye"></i> View</a></td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    // బటన్ టెక్స్ట్ మార్చడం
    const btn = document.getElementById("loadMoreBtn");
    if (showAll) {
        btn.innerHTML = `Show Less <i class="fa-solid fa-chevron-up"></i>`;
    } else {
        btn.innerHTML = `More Tenders (${allTenders.length - 5}+) <i class="fa-solid fa-chevron-down"></i>`;
    }
}

function toggleTenders() {
    showAll = !showAll;
    renderTable();
}

function searchTenders() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("tenderTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let text = tr[i].innerText.toLowerCase();
        tr[i].style.display = text.includes(input) ? "" : "none";
    }
}
