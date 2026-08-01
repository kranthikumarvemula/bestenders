document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            
            // 1. క్లోజింగ్ టైమ్ దాటని (యాక్టివ్) టెండర్లను మాత్రమే ఉంచడం
            let activeTenders = data.filter(tender => {
                try {
                    const closingDateTime = parseGovDate(tender.date);
                    return closingDateTime > now; 
                } catch (e) {
                    return true; 
                }
            });

            // 2. సరికొత్త టెండర్లు అందరికంటే పైన కనిపించేలా సార్ట్ చేయడం (Latest First)
            activeTenders.sort((a, b) => {
                try {
                    return parseGovDate(b.startDate) - parseGovDate(a.startDate);
                } catch (e) {
                    return 0;
                }
            });

            renderPremiumTable(activeTenders);
        })
        .catch(error => {
            console.error("డేటా లోడ్ చేయడంలో ఇబ్బంది వచ్చింది:", error);
            document.getElementById("totalCount").innerText = "Error Loading Data";
        });
}

// ప్రభుత్వ సైట్ డేట్ ఫార్మాట్‌ను (DD-MM-YYYY hh:mm AM/PM) పక్కాగా రీడ్ చేసే ఫంక్షన్
function parseGovDate(dateStr) {
    if (!dateStr) return new Date();
    const parts = dateStr.split(/[- :]/);
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    let hour = parseInt(parts[3], 10);
    const min = parseInt(parts[4], 10);
    const ampm = dateStr.slice(-2).toUpperCase();

    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    return new Date(year, month, day, hour, min);
}

function renderPremiumTable(tenders) {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    document.getElementById("totalCount").innerText = `${tenders.length} Active Tenders Available`;

    if (tenders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#94a3b8; padding:30px; font-weight:500;">లైవ్ టెండర్లు ఏవీ అందుబాటులో లేవు. ప్రభుత్వ సైట్ అప్‌డేట్ కోసం వేచి చూస్తోంది...</td></tr>`;
        return;
    }

    tenders.forEach(tender => {
        const row = `<tr>
            <td><span style="color:#3b82f6; font-weight:600; font-size:13px;">${tender.deptName}</span></td>
            <td><code style="background:#1e293b; padding:4px 8px; border-radius:4px; color:#f43f5e; font-weight:600;">${tender.id}</code></td>
            <td style="font-size:13px;">${tender.noticeNo}</td>
            <td><span style="background:rgba(59, 130, 246, 0.1); color:#3b82f6; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:600;">${tender.category}</span></td>
            <td style="max-width: 320px; font-weight:500; line-height:1.4;">${tender.description}</td>
            <td style="color:#10b981; font-weight:600;">${tender.value}</td>
            <td style="font-size:12px; color:#94a3b8;">${tender.startDate}</td>
            <td style="font-size:12px; color:#f43f5e; font-weight:500;">${tender.date}</td>
            <td style="text-align:center;"><a href="https://tender.apeprocurement.gov.in/" target="_blank" class="btn-view-premium"><i class="fa-solid fa-eye"></i> View</a></td>
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
