    document.getElementById('form-video').addEventListener('submit', async function(e) {
      e.preventDefault();

      const titulo = document.getElementById('titulo').value.trim();
      const enlace = document.getElementById('enlace').value.trim();
      const descripcion = document.getElementById('descripcion').value.trim();

      if (!titulo || !enlace) { 
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }
      

      try {
        const response = await fetch('http://localhost:3000/agregar-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, enlace, descripcion })
        });

        const data = await response.json();

        if (data.status === 'success') {
          alert('Video agregado exitosamente');
          this.reset();
          document.getElementById('preview').innerHTML = '';
        } else {
          alert('Error al agregar el video');
        }
      } catch (error) {
        alert('Error en la conexión con el servidor');
        console.error(error);
      }
    });

    function obtenerVistaPrevia(url) {
  const preview = document.getElementById('preview');
  preview.innerHTML = ''; // Limpiar previo

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(youtubeRegex);
  if (ytMatch) {
    const videoId = ytMatch[1];
    preview.innerHTML = `
      <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0" allowfullscreen></iframe>`;
    return;
  }

  // TikTok
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.+\/video\/(\d+)/;
  const ttMatch = url.match(tiktokRegex);
  if (ttMatch) {
    const videoUrl = url.split('?')[0]; // limpia posibles parámetros
    preview.innerHTML = `
      <blockquote class="tiktok-embed"
        cite="${videoUrl}"
        data-video-id="${ttMatch[1]}"
        style="max-width: 100%; min-width: 300px;"
      >
        <section>Loading TikTok...</section>
      </blockquote>
    `;
    // Cargar script de TikTok si no está ya en el DOM
    if (!document.getElementById('tiktok-script')) {
      const script = document.createElement('script');
      script.id = 'tiktok-script';
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Si ya existe, vuelve a correr el script para actualizar
      window.tiktok && window.tiktok.init && window.tiktok.init();
    }
  }
}
document.getElementById('enlace').addEventListener('input', function () {
  const url = this.value.trim();
  obtenerVistaPrevia(url);
  
});const toggleDropdown = (dropdown, menu, isOpen) => {
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
