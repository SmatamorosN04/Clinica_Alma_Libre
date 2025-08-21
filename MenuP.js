

// Ocultar dropdowns si se hace clic fuera
window.onclick = function(event) {
    if (!event.target.matches('.menu-item a')) {
        const dropdowns = [
            document.getElementById("info-dropdown-paciente"),
            document.getElementById("info-dropdown-psicologo"),
            document.getElementById("info-dropdown-pacientes")
        ];

        dropdowns.forEach(dd => {
            if (dd) {
                dd.style.display = "none";
            }
        });
    }
};

// Mostrar menú según el tipo de usuario
function mostrarMenuPorRol(rol) {
    if (rol === 'paciente') {
        document.getElementById('menu-paciente').style.display = 'block';
        document.getElementById('menu-psicologo').style.display = 'none';
    } else if (rol === 'psicologo') {
        document.getElementById('menu-paciente').style.display = 'none';
        document.getElementById('menu-psicologo').style.display = 'block';
    } else { 
        console.error('Tipo de usuario no reconocido:', rol);
    }
}

// Lógica principal al cargar la página



function cerrarSesion() {
    localStorage.removeItem('tipo_usuario'); // Elimina la sesión del usuario
    window.location.href = 'Uno.html'; // Redirige al login
}

function verCitas(){
    alert("Redirigiendo a la página de citas...");
    window.location.href = 'solicitudcitas.html'; // Redirige a la página de citas
}
function VerVideos() {
    alert("Redirigiendo a la página de videos...");
    window.location.href = 'Videos.html'; // Redirige a la página de videos
}
function verArticulos() {
    alert("Redirigiendo a la página de artículos...");
    window.location.href = 'articulos.html'; // Redirige a la página de artículos
}
function verPacientes() {}
function agregarVideo() {
    alert("Redirigiendo a la página de agregar video...");
    window.location.href = 'agregarVideos.html'; // Redirige a la página de agregar video
}
function agregarLectura() {
    alert("Redirigiendo a la página de agregar artículo...");
    window.location.href = 'agregarLecturas.html'; // Redirige a la página
}
function historialcitas() {
    alert("Redirigiendo a la página de historial de citas...");
    window.location.href = 'historialcitas.html'; // Redirige a la página de historial de citas
}
function verAgenda() {
  window.location.href = 'GestionCitas.html'; // Redirige a la página de agenda
}
function editarusuario(){
      alert("Redirigiendo a la página de editar usuario...");
    window.location.href = 'EdicionUsuario.html'; // Redirige a la página de editar usuario
}
function antecedentes(){
    alert("Redirigiendo a la página de antecedentes...");
    window.location.href = 'antecedentes.html'; // Redirige a la página de antecedentes
}
// Toggle the visibility of a dropdown menu
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

function iniciarSesion() {
  const usuarioInput = document.getElementById('usuario');
  const passwordInput = document.getElementById('password');

  // Validar existencia de campos (previene el error si no estamos en la página de login)
  if (!usuarioInput || !passwordInput) {
    console.warn('Campos de login no encontrados en esta página.');
    return;
  }

  const usuario = usuarioInput.value;
  const password = passwordInput.value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        localStorage.setItem('usuario', usuario);
        localStorage.setItem('tipo_usuario', data.tipo_usuario);
        localStorage.setItem('id_usuario', data.id_usuario);
        window.location.href = 'MenuP.html';
      } else {
        alert('Credenciales incorrectas');
      }
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error);
    });
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


// Al cargar la página
window.onload = function () {
  const tipoUsuario = localStorage.getItem('tipo_usuario');

  if (tipoUsuario) {
    mostrarMenuPorRol(tipoUsuario.toLowerCase());
    mostrarPerfil();
  } else {
    alert('Usuario no identificado. Redirigiendo al inicio...');
    window.location.href = 'Uno.html';
  }
};
document.getElementById('perfil').addEventListener('click', (e) => {
  // Si el click es en el fondo (no dentro del contenido)
  if (e.target.id === 'perfil') {
    document.getElementById('perfil').style.display = 'none';
  }
});
