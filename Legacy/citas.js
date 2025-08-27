function cargarHistorialCitas() {
  const usuario = localStorage.getItem('usuario');
  if (!usuario) {
      console.error('Usuario no encontrado en localStorage');
      return;
  }

  fetch(`http://localhost:3000/historial-citas/${usuario}`)
      .then(res => res.json())
      .then(data => {
          const tabla = document.getElementById('tabla-citas');
          tabla.innerHTML = ''; // Limpiar tabla

          if (data.status === 'success' && data.citas.length > 0) {
              data.citas.forEach(cita => {
                  const tr = document.createElement('tr');

                  tr.innerHTML = `
                    <td>${new Date(cita.fecha).toLocaleDateString()}</td>
                    <td>${cita.hora.slice(0,5)}</td>
                    <td>${cita.estado}</td>
                    <td>${cita.nombre}</td>
                  `;
                  tabla.appendChild(tr);
              });
          } else {
              tabla.innerHTML = '<tr><td colspan="4">No hay citas registradas.</td></tr>';
          }
      })
      .catch(error => {
          console.error('Error al cargar historial de citas:', error);
      });
}

// Llamar al cargar
window.onload = () => {
  cargarHistorialCitas();
};
const toggleDropdown = (dropdown, menu, isOpen) => {
  dropdown.classList.toggle("open", isOpen);
  menu.style.height = isOpen ? `${menu.scrollHeight}px` : 0;
};
// Close all open dropdowns
const closeAllDropdowns = () => {
  document.querySelectorAll(".dropdown-container.open").forEach((openDropdown) => {
    toggleDropdown(openDropdown, openDropdown.querySelector(".dropdown-menu"), false);
  });
};
// Attach click event to all dropdown toggles
document.querySelectorAll(".dropdown-toggle").forEach((dropdownToggle) => {
  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const dropdown = dropdownToggle.closest(".dropdown-container");
    const menu = dropdown.querySelector(".dropdown-menu");
    const isOpen = dropdown.classList.contains("open");
    closeAllDropdowns(); // Close all open dropdowns
    toggleDropdown(dropdown, menu, !isOpen); // Toggle current dropdown visibility
  });
});
// Attach click event to sidebar toggle buttons
document.querySelectorAll(".sidebar-toggler, .sidebar-menu-button").forEach((button) => {
  button.addEventListener("click", () => {
    closeAllDropdowns(); // Close all open dropdowns
    document.querySelector(".sidebar").classList.toggle("collapsed"); // Toggle collapsed class on sidebar
  });
});
