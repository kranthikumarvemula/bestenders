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

    document.getElementById("totalCount").innerText = `${tenders.length} Tenders Available`;

    tenders.forEach(tender => {
        // ఒకవేళ ఏ డేటా అయినా మిస్ అయితే ఖాళీగా ఉంచకుండా ప్రత్యామ్నాయ విలువలు
        const dept = tender.deptName || "AP eProcurement";
        const tid = tender.id || "N/A";
        const notice = tender.noticeNo || "N/A";
        const cat = tender.category || "WORKS";
        const desc = tender.description || "ప్రభుత్వ పనులు";
        const val = tender.value || "Refer Doc";
        const sDate = tender.startDate || "N/A";
        const cDate = tender.date || "N/A";

        const row = `<tr>
            <td><span style="color:#3b82f6; font-weight:600; font-size:13px;">${dept}</span></td>
            <td><code style="background:#1e293b; padding:4px 8px; border-radius:4px; color:#f43f5e; font-weight:600;">${tid}</code></td>
            <td style="font-size:13px;">${notice}</td>
            <td><span style="background:rgba(59, 130, 246, 0.1); color:#3b82f6; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:600;">${cat}</span></td>
            <td style="max-width: 320px; font-weight:500; line-height:1.4;">${desc}</td>
            <td style="color:#10b981; font-weight:600;">${val}</td>
            <td style="font-size:12px; color:#94a3b8;">${sDate}</td>
            <td style="font-size:12px; color:#f43f5e; font-weight:500;">${cDate}</td>
            <td style="text-align:center;"><a href="https://apeprocurement.gov.in" target="_blank" class="btn-view-premium"><i class="fa-solid fa-eye"></i> View</a></td>
        </tr>`;
        tableBody.innerHTML += row;
    });
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
