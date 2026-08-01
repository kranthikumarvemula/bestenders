document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            
            // 1. గడువు ముగియని (Active) టెండర్లను మాత్రమే ఉంచడం
            let activeTenders = data.filter(tender => {
                try {
                    // ఫార్మాట్ మార్చడం: DD-MM-YYYY hh:mm AM/PM నుండి JS Date ఆబ్జెక్ట్‌లోకి
                    const parts = tender.date.split(/[- :]/);
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    const year = parseInt(parts[2], 10);
                    let hour = parseInt(parts[3], 10);
                    const min = parseInt(parts[4], 10);
                    const ampm = tender.date.slice(-2).toUpperCase();

                    if (ampm === "PM" && hour < 12) hour += 12;
                    if (ampm === "AM" && hour === 12) hour = 0;

                    const closingDateTime = new Date(year, month, day, hour, min);
                    return closingDateTime > now; 
                } catch (e) {
                    return true; 
                }
            });

            // 2. రీసెంట్ టెండర్లు మొదట కనిపించేలా సార్ట్ చేయడం (Latest First)
            activeTenders.sort((a, b) => {
                try {
                    const partsA = a.startDate.split(/[- :]/);
                    let hourA = parseInt(partsA[3], 10);
                    if (a.startDate.slice(-2).toUpperCase() === "PM" && hourA < 12) hourA += 12;
                    if (a.startDate.slice(-2).toUpperCase() === "AM" && hourA === 12) hourA = 0;
                    const dateA = new Date(partsA[2], partsA[1]-1, partsA[0], hourA, parseInt(partsA[4], 10));

                    const partsB = b.startDate.split(/[- :]/);
                    let hourB = parseInt(partsB[3], 10);
                    if (b.startDate.slice(-2).toUpperCase() === "PM" && hourB < 12) hourB += 12;
                    if (b.startDate.slice(-2).toUpperCase() === "AM" && hourB === 12) hourB = 0;
                    const dateB = new Date(partsB[2], partsB[1]-1, partsB[0], hourB, parseInt(partsB[4], 10));

                    return dateB - dateA; // సరికొత్త తేదీలు పైకి వస్తాయి
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

function renderPremiumTable(tenders) {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    document.getElementById("totalCount").innerText = `${tenders.length} Active Tenders Available`;

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
