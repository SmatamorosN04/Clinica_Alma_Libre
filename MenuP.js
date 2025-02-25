function toggleDropdown() {
    const dropdown = document.getElementById("info-dropdown");
    if (dropdown.style.display === "block"){
        dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
        }
}

window.onclick = function(event){
    const dropdown = document.getElementById("info-dropdown");
    if (!event.target.matches('.menu-item a')){
        dropdown.style.display = "none";
    }
};