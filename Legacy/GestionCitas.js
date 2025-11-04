let citas = []; // Aquí almacenaremos las citas traídas del backend
let citaSeleccionada = null;

// Referencias DOM
const cuerpoCitas = document.getElementById('cuerpo-citas');
const modalEditar = document.getElementById('modal-editar');
const inputFecha = document.getElementById('editar-fecha');
const inputHora = document.getElementById('editar-hora');
const btnGuardarCambios = document.getElementById('guardar-cambios');
const btnCancelarEdicion = document.getElementById('cancelar-edicion');

// Función para cargar las citas desde backend
function cargarCitas() {
  fetch('http://localhost:3000/citas') // Cambia a tu ruta real
    .then(res => res.json())
    .then(data => {
      if(data.status === 'success') {
        citas = data.citas;
        renderizarCitas();
      } else {
        alert('Error al cargar citas');
      }
    })
    .catch(err => console.error('Error al obtener citas:', err));
}

// Función para renderizar las citas en la tabla
function renderizarCitas() {
  cuerpoCitas.innerHTML = '';
  citas.forEach(cita => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${cita.nombre_paciente}</td>
      <td>${formatearFecha(cita.fecha)}</td>
      <td>${cita.hora.slice(0,5)}</td>
      <td>${cita.estado}</td>
      <td>
        <button class="btn-cambiar" data-id="${cita.id_cita}">Cambiar fecha/hora</button>
        <button class="btn-aceptar" data-id="${cita.id_cita}">Aceptar</button>
        <button class="btn-denegar" data-id="${cita.id_cita}">Denegar</button>
      </td>
    `;

    cuerpoCitas.appendChild(tr);
  });

  // Asignar eventos a botones
  document.querySelectorAll('.btn-cambiar').forEach(btn => {
    btn.addEventListener('click', abrirModalEdicion);
  });

  document.querySelectorAll('.btn-aceptar').forEach(btn => {
    btn.addEventListener('click', () => cambiarEstadoCita(btn.dataset.id, 'aceptado'));
  });

  document.querySelectorAll('.btn-denegar').forEach(btn => {
    btn.addEventListener('click', () => cambiarEstadoCita(btn.dataset.id, 'cancelado'));
  });
}

// Formatear fecha YYYY-MM-DD -> DD/MM/YYYY
function formatearFecha(fecha) {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

// Abrir modal para editar
function abrirModalEdicion(event) {
  const id = event.target.dataset.id;
  citaSeleccionada = citas.find(c => c.id_cita == id);

  if (!citaSeleccionada) {
    alert('Cita no encontrada');
    return;
  }

  inputFecha.value = citaSeleccionada.fecha;
  inputHora.value = citaSeleccionada.hora.slice(0,5);

  modalEditar.style.display = 'flex';
}

// Cerrar modal
function cerrarModalEdicion() {
  modalEditar.style.display = 'none';
  citaSeleccionada = null;
}

// Guardar cambios en backend
function guardarCambios() {
  if (!citaSeleccionada) return;

  const nuevaFecha = inputFecha.value;
  const nuevaHora = inputHora.value;

  if (!nuevaFecha || !nuevaHora) {
    alert('Por favor ingrese una fecha y hora válidas');
    return;
  }

  fetch(`http://localhost:3000/citas/${citaSeleccionada.id_cita}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fecha: nuevaFecha, hora: nuevaHora })
  })
  .then(res => res.json())
  .then(data => {
    if (data.status === 'success') {
      alert('Cita actualizada');
      // Actualiza el array y recarga la tabla
      citaSeleccionada.fecha = nuevaFecha;
      citaSeleccionada.hora = nuevaHora;
      renderizarCitas();
      cerrarModalEdicion();
    } else {
      alert('Error al actualizar la cita');
    }
  })
  .catch(err => {
    console.error('Error actualizando cita:', err);
  });
}

// Cambiar estado de la cita (aceptar o denegar)
function cambiarEstadoCita(id, nuevoEstado) {
  fetch(`http://localhost:3000/citas/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: nuevoEstado })
  })
  .then(res => res.json())
  .then(data => {
    if(data.status === 'success') {
      alert(`Cita ${nuevoEstado}`);
      // Actualizar array y refrescar tabla
      if(nuevoEstado === 'cancelado') {
        // Eliminar la cita del array
        citas = citas.filter(c => c.id_cita != id);
      } else {
        // Solo actualizar el estado
        const cita = citas.find(c => c.id_cita == id);
        if(cita) {
          cita.estado = nuevoEstado;
        }
      }
      renderizarCitas();
    } else {
      alert('Error al cambiar estado');
    }
  })
  .catch(err => console.error('Error al cambiar estado:', err));
}

// Eventos modal botones
btnGuardarCambios.addEventListener('click', guardarCambios);
btnCancelarEdicion.addEventListener('click', cerrarModalEdicion);

// Cargar citas al cargar la página
window.onload = cargarCitas;
