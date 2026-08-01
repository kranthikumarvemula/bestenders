document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            
            let processedTenders = data.map(tender => {
                return {
                    deptName: tender.deptName || "Andhra Pradesh Government",
                    id: tender.id || "AP-TNDR-XYZ",
                    noticeNo: tender.noticeNo || "N/A",
                    category: tender.category || "WORKS",
                    description: tender.description || "Government Contract Works / Services",
                    value: tender.value || "Refer Document",
                    startDate: tender.startDate || "01-08-2026 10:00 AM",
                    date: tender.date || "15-08-2026 05:00 PM"
                };
            });

            // సార్టింగ్ లాజిక్: లేటెస్ట్ టెండర్లు అందరికంటే పైన కనిపిస్తాయి
            processedTenders.sort((a, b) => {
                try {
                    return parseGovDate(b.startDate) - parseGovDate(a.startDate);
                } catch (e) {
                    return 0;
                }
            });

            renderPremiumTable(processedTenders);
        })
        .catch(error => {
            console.error("Error loading tender data:", error);
            document.getElementById("totalCount").innerText = "Error Loading Data";
        });
}

// ఎలాంటి డేట్ ఫార్మాట్ (AM/PM లేదా నార్మల్) నైనా పక్కాగా రీడ్ చేసే కొత్త ఫంక్షన్
function parseGovDate(dateStr) {
    if (!dateStr) return new Date();
    try {
        // స్పేస్, హైఫన్, కోలన్ అన్నింటినీ క్లీన్‌గా విడగొట్టేలా రెగ్యులర్ ఎక్స్‌ప్రెషన్ మార్చబడింది
        const parts = dateStr.split(/[\s-:]+/);
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        let hour = parseInt(parts[3], 10) || 12;
        const min = parseInt(parts[4], 10) || 0;
        
        const ampm = dateStr.toUpperCase();
        if (ampm.includes("PM") && hour < 12) hour += 12;
        if (ampm.includes("AM") && hour === 12) hour = 0;

        return new Date(year, month, day, hour, min);
    } catch (e) {
        return new Date();
    }
}

function renderPremiumTable(tenders) {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    document.getElementById("totalCount").innerText = `${tenders.length} Active Tenders Available`;

    if (tenders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#94a3b8; padding:30px; font-weight:500;">No live tenders available at the moment. Waiting for government server update...</td></tr>`;
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
