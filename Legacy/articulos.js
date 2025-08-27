let articulos = [];

async function cargarArticulos() {
  try {
    const res = await fetch('http://localhost:3000/lecturas');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    if (data.status === 'success') {
      articulos = data.lecturas;
      mostrarArticulos(articulos);
    } else {
      alert('Error al cargar los artículos');
    }
  } catch (error) {
    console.error('Error al obtener artículos:', error);
    alert('Error al obtener artículos');
  }
}

function mostrarArticulos(lista) {
  const ul = document.getElementById('lista-articulos'); // Obtiene el <ul> donde pondremos los artículos
  ul.innerHTML = ''; // Limpia el contenido para no repetir

  lista.forEach(articulo => {
    const li = document.createElement('li'); // Crea un <li> nuevo por cada artículo
li.innerHTML = `<a href="#" onclick="mostrarDetalleLectura(${articulo.id_lectura})">${articulo.titulo}</a>`;
    ul.appendChild(li); // Lo agrega al <ul>
  });
}


function ordenarAlfabetico() {
  const ordenado = [...articulos].sort((a, b) =>
    a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' })
  );
  mostrarArticulos(ordenado);
}

function ordenarPorFecha() {
  alert('Función no implementada. Necesita campo fecha en base de datos.');
}

function filtrarArticulos() {
  const texto = document.getElementById('search').value.toLowerCase();
  const filtrados = articulos.filter(a =>
    a.titulo.toLowerCase().includes(texto)
  );
  mostrarArticulos(filtrados);
}

window.onload = () => {
  cargarArticulos();

  const searchInput = document.getElementById('search');
  if (searchInput) {
    searchInput.addEventListener('input', filtrarArticulos);
  }
};
function mostrarDetalleLectura(id) {
  const lectura = articulos.find(a => a.id_lectura === id);
  if (!lectura) return alert('Lectura no encontrada');

  document.querySelector('.articulos-content').style.display = 'none'; // Oculta la lista
  document.getElementById('lectura-detalle').style.display = 'block';

  document.getElementById('detalle-titulo').textContent = lectura.titulo;
  document.getElementById('detalle-contenido').innerHTML = lectura.contenido;
}
function volverALista() {
  document.getElementById('lectura-detalle').style.display = 'none';
  document.querySelector('.articulos-content').style.display = 'block';
}
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

function cerrarSesion() {
    localStorage.removeItem('tipo_usuario'); // Elimina la sesión del usuario
    window.location.href = 'Uno.html'; // Redirige al login
}
function verCitas(){
    alert("Redirigiendo a la página de citas...");
    window.location.href = 'solicitudcitas.html'; // Redirige a la página de citas
}

function historialcitas() {
    alert("Redirigiendo a la página de historial de citas...");
    window.location.href = 'historialcitas.html'; // Redirige a la página de historial de citas
}
