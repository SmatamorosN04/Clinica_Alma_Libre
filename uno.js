

// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex'; // Mostrar el modal
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none'; // Ocultar el modal
}

window.onclick = function(event) {
    var modal1 = document.getElementById('modal1');
    var modal2 = document.getElementById('modal2');

    if (event.target === modal1){
        modal1.style.display = 'none';
    } else if (event.target === modal2) {
        modal2.style.display = 'none';
    }
};
function redirectToMenu(event){
    event.preventDefault();
    window.location.href = 'MenuP.html';
}