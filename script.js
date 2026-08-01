function searchTenders() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("tenderTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) {
        let tdCategory = tr[i].getElementsByTagName("td")[1];
        let tdDesc = tr[i].getElementsByTagName("td")[2];
        
        if (tdCategory || tdDesc) {
            let textValue = (tdCategory.textContent || tdCategory.innerText) + " " + (tdDesc.textContent || tdDesc.innerText);
            if (textValue.toLowerCase().indexOf(input) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}
