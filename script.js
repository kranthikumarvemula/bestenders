document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            renderPremiumTable(data);
        })
        .catch(error => {
            console.error("డేటా లోడ్ చేయడంలో ఇబ్బంది వచ్చింది:", error);
            document.getElementById("totalCount").innerText = "Error Loading Data";
        });
}

function renderPremiumTable(tenders) {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    // టోటల్ టెండర్ల కౌంట్ అప్‌డేట్ చేయడం
    document.getElementById("totalCount").innerText = `${tenders.length} Tenders Available`;

    tenders.forEach(tender => {
        const row = `<tr>
            <td><span style="color:#3b82f6; font-weight:600;">${tender.deptName}</span></td>
            <td><code style="background:#1e293b; padding:3px 6px; border-radius:4px; color:#f43f5e;">${tender.id}</code></td>
            <td>${tender.noticeNo}</td>
            <td style="max-width: 300px; font-weight:500;">${tender.description}</td>
            <td style="color:#10b981; font-weight:600;">${tender.value}</td>
            <td style="font-size:12px; color:#94a3b8;">${tender.startDate}</td>
            <td style="font-size:12px; color:#f43f5e; font-weight:500;">${tender.date}</td>
            <td style="text-align:center;"><a href="https://tender.apeprocurement.gov.in/" target="_blank" class="btn-view-premium"><i class="fa-solid fa-eye"></i> View</a></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// టైపింగ్ చేస్తుండగానే వెతికే ఫాస్ట్ సెర్చ్ ఫంక్షన్
function searchTenders() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("tenderTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let text = tr[i].innerText.toLowerCase();
        tr[i].style.display = text.includes(input) ? "" : "none";
    }
}
