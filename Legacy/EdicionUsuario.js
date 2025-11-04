document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-editar-perfil');
  const camposPsicologo = document.getElementById('campos-psicologo');
  const mensaje = document.getElementById('mensaje');

  // Función para cargar datos del usuario (usa la ruta /perfil/:usuario)
  async function cargarDatosUsuario() {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      mensaje.textContent = 'No hay usuario logueado.';
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/perfil/${usuario}`);
      const data = await res.json();
      if (data.status === 'success') {
        const u = data.datos;
        document.getElementById('nombre').value = u.nombre;
        document.getElementById('telefono').value = u.telefono;
        document.getElementById('email').value = u.email;
        document.getElementById('fecha-nacimiento').value = u.fecha_nacimiento?.split('T')[0] || '';

        // Mostrar campos psicólogo si corresponde
        if (u.tipo_usuario === 'psicologo') {
          camposPsicologo.style.display = 'block';
          document.getElementById('especialidad').value = u.especialidad || '';
          document.getElementById('experiencia').value = u.experiencia || '';
        } else {
          camposPsicologo.style.display = 'none';
        }
      } else {
        mensaje.textContent = 'Error al cargar datos del usuario.';
      }
    } catch (error) {
      mensaje.textContent = 'Error al conectar con el servidor.';
      console.error(error);
    }
  }

  // Validación y envío de formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value;

    if (password !== confirmPassword) {
      mensaje.textContent = 'Las contraseñas no coinciden.';
      return;
    }

    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      mensaje.textContent = 'No hay usuario logueado.';
      return;
    }

    const datos = {
      nombre: form.nombre.value,
      telefono: form.telefono.value,
      email: form.email.value,
      direccion: form.direccion?.value || '', // Asegura que dirección no quede fuera
      fecha_nacimiento: form['fecha-nacimiento'].value,
      password: password || undefined,
      especialidad: camposPsicologo.style.display === 'block' ? form.especialidad.value : undefined,
      experiencia: camposPsicologo.style.display === 'block' ? form.experiencia.value : undefined,
    };

    try {
      const res = await fetch(`http://localhost:3000/perfil/${usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });

      const resultado = await res.json();

      if (resultado.status === 'success') {
        mensaje.style.color = 'green';
        mensaje.textContent = 'Perfil actualizado correctamente.';
      } else {
        mensaje.style.color = 'red';
        mensaje.textContent = resultado.message || 'Error al actualizar perfil.';
      }
    } catch (error) {
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error al conectar con el servidor.';
      console.error(error);
    }
  });

  cargarDatosUsuario();
});
