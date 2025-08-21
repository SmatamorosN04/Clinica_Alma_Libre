

 CKEDITOR.replace('titulo', {
    height: 100,
    toolbar: [
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
      { name: 'links', items: ['Link'] },
      { name: 'document', items: ['Source'] }
    ]
  });
  CKEDITOR.replace('contenido', {
      height: 300
    });

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

const titulo = CKEDITOR.instances['titulo'].document.getBody().getText(); // solo texto plano
const contenido = CKEDITOR.instances['contenido'].document.getBody().getText(); // solo texto plano

  const res = await fetch('http://localhost:3000/agregar-lectura', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ titulo, contenido })
  });

  const data = await res.json();
  if (data.status === 'success') {
    alert('Lectura guardada correctamente');
  } else {
    alert('Error al guardar la lectura');
  }
});
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
function historialcitas() {
    alert("Redirigiendo a la página de historial de citas...");
    window.location.href = 'historialcitas.html'; // Redirige a la página de historial de citas
}
function cerrarSesion() {
    localStorage.removeItem('tipo_usuario'); // Elimina la sesión del usuario
    window.location.href = 'Uno.html'; // Redirige al login
}
function verCitas(){
    alert("Redirigiendo a la página de citas...");
    window.location.href = 'solicitudcitas.html'; // Redirige a la página de citas
}
async function mostrarPerfil() {
  const id = localStorage.getItem('id_usuario');
  if (!id) return alert('Usuario no identificado');

  try {
    const res = await fetch(`http://localhost:3000/perfil/${id}`);

    if (!res.ok) {
      alert('Error al obtener el perfil: ' + res.status + ' ' + res.statusText);
      return;
    }

    // Verificamos que el content-type sea json
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Respuesta no es JSON:', text);
      alert('Error: respuesta no es JSON. Mira la consola.');
      return;
    }

    const data = await res.json();

    if (data.status === 'success') {
      const { nombre, genero, direccion, fecha_nacimiento, tipo_usuario } = data.datos;

      const nacimiento = new Date(fecha_nacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - nacimiento.getFullYear();

      document.querySelector('.front__text-header').textContent = nombre;
      document.querySelector('.front__text-para').innerHTML = `<i class="fas fa-map-marker-alt front-icons"></i> ${direccion}`;
      document.querySelector('.front__text-hover').textContent = tipo_usuario;
      document.querySelector('.back .social-media-wrapper ul').innerHTML = `
        <li>Edad: ${edad} años</li>
        <li>Género: ${genero}</li>
      `;

      document.getElementById('perfil').style.display = 'block';
    } else {
      alert('Error al cargar el perfil: ' + data.message);
    }
  } catch (err) {
    console.error('Error al cargar perfil:', err);
    alert('Error al cargar perfil. Mira la consola.');
  }
}