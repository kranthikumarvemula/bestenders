document.addEventListener("DOMContentLoaded", () => {
    loadLiveTenders();
});

function loadLiveTenders() {
    fetch('tenders.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            const now = new Date();
            
            // ఈరోజు ఉదయం కచ్చితంగా 11:00 AM IST సమయాన్ని సెట్ చేయడం
            const today11AM = new Date();
            today11AM.setHours(11, 0, 0, 0); 

            // 1. క్లోజింగ్ టైమ్ దాటని మరియు 11:00 AM తర్వాత వచ్చిన టెండర్లను మాత్రమే ఉంచడం
            let filteredTenders = data.filter(tender => {
                try {
                    const startDateTime = parse24HourDate(tender.startDate);
                    const closingDateTime = parse24HourDate(tender.date);
                    
                    // కండిషన్: క్లోజింగ్ టైమ్ ఇంకా అవ్వకూడదు మరియు స్టార్ట్ టైమ్ 11:00 AM లేదా ఆ తర్వాత ఉండాలి
                    return closingDateTime > now && startDateTime >= today11AM; 
                } catch (e) {
                    return false; 
                }
            });

            // 2. సరికొత్తగా అప్‌డేట్ అయిన డేటా మొదట కనిపించేలా సార్ట్ చేయడం (Latest First)
            filteredTenders.sort((a, b) => {
                try {
                    return parse24HourDate(b.startDate) - parse24HourDate(a.startDate);
                } catch (e) {
                    return 0;
                }
            });

            renderPremiumTable(filteredTenders);
        })
        .catch(error => {
            console.error("డేటా లోడ్ చేయడంలో ఇబ్బంది వచ్చింది:", error);
            document.getElementById("totalCount").innerText = "Error Loading Data";
        });
}

// 24-గంటల ఫార్మాట్ స్ట్రింగ్‌ను (DD-MM-YYYY-HH-MM) పక్కాగా జావాస్క్రిప్ట్ డేట్ ఆబ్జెక్ట్‌గా మార్చే ఫంక్షన్
function parse24HourDate(dateStr) {
    const parts = dateStr.split('-');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const hour = parseInt(parts[3], 10);
    const min = parseInt(parts[4], 10);
    return new Date(year, month, day, hour, min);
}

// యూజర్‌కు స్క్రీన్‌పై అర్థమయ్యేలా 12-గంటల (AM/PM) రూపంలోకి మార్చే ఫంక్షన్
function formatTo12Hour(dateStr) {
    try {
        const parts = dateStr.split('-');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        let hour = parseInt(parts[3], 10);
        const min = parts[4];
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour ? hour : 12; // 0 ని 12 గా మార్చడం
        return `${day}-${month}-${year} ${hour}:${min} ${ampm}`;
    } catch(e) {
        return dateStr;
    }
}

function renderPremiumTable(tenders) {
    const tableBody = document.querySelector("#tenderTable tbody");
    tableBody.innerHTML = ""; 

    document.getElementById("totalCount").innerText = `${tenders.length} Active Tenders (Since 11:00 AM)`;

    if (tenders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#94a3b8; padding:30px; font-weight:500;">ఉదయం 11:00 AM తర్వాత కొత్త టెండర్లు ఏవీ అప్‌డేట్ కాలేదు. ప్రభుత్వ సైట్ అప్‌డేట్ కోసం వేచి చూస్తోంది...</td></tr>`;
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
            <td style="font-size:12px; color:#94a3b8;">${formatTo12Hour(tender.startDate)}</td>
            <td style="font-size:12px; color:#f43f5e; font-weight:500;">${formatTo12Hour(tender.date)}</td>
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
