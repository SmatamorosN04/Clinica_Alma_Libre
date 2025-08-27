
function toggleDropdown() {
    const dropdown = document.getElementById("info-dropdown");
    if (dropdown.style.display === "block"){
        dropdown.style.display = "none";
        } else {
            dropdown.style.display = "block";
        }
}

window.onclick = function(event) {
    // Dropdown info
    const dropdown = document.getElementById("info-dropdown");
    if (!event.target.matches('.menu-item a')) {
        if (dropdown) dropdown.style.display = "none";
    }

    // Modal cerrado al click fuera
    var modal1 = document.getElementById('modal1');
    var modal2 = document.getElementById('modal2');

    if (event.target === modal1) {
        modal1.style.display = 'none';
    } else if (event.target === modal2) {
        modal2.style.display = 'none';
    }
};


// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex'; // Mostrar el modal
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none'; // Ocultar el modal
}

function redirectToMenu(event){
    event.preventDefault();
    window.location.href = 'Uno.html';
}
//conectar a la base de datos el registro de usuarios
const registerform = document.querySelector('#modal1 form');

registerform.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const usuario = registerform.usuario.value;
    const password = registerform.password_registro.value;
    const password_verificar = registerform.password_verificar.value;
    const nombre = registerform.nombre.value;
    const telefono = registerform.telefono.value;
    const email = registerform.email.value;
    const fecha_nacimiento = registerform.fecha_nacimiento.value;
    const genero = registerform.genero.value;
    const direccion = registerform.direccion.value;
    const tipo_usuario = registerform.tipo_usuario.value;

    if (password !== password_verificar) {
        alert('Las contraseñas no coinciden');
        return;
    }

    fetch('http://localhost:3000/registro', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        usuario,
        password,
        nombre,
        telefono,
        email,
        fecha_nacimiento,
        genero,
        direccion,
        tipo_usuario
    })
})
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            alert('Registro exitoso ahora puedes iniciar sesión');
            closeModal('modal1');

            

        } else {
            alert('Error en el registro' + data.message);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error al conectar con el servidor');
    });
});

//conectar a la base de datos el login de usuarios

const loginform = document.querySelector('#modal2 form');

loginform.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = loginform.usuario.value;
    const password = loginform.password.value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        const data = await response.json();

        if (data.status === 'success') {
            closeModal('modal2');
            localStorage.setItem('usuario', usuario);
            localStorage.setItem('tipo_usuario', data.tipo_usuario);
            localStorage.setItem('id_usuario', data.id_usuario);

            // Registrar evento login
            await fetch('http://localhost:3000/reportes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tipo: 'login', usuario })
            });

            window.location.href = 'MenuP.html';
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error al conectar con el servidor');
    }
});
