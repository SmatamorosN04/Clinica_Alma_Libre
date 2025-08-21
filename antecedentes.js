let pacienteSeleccionado = null;

document.addEventListener('DOMContentLoaded', () => {
  const inputBusqueda = document.getElementById('buscar-paciente-input');
  const listaPacientes = document.getElementById('lista-pacientes');
  const nombrePaciente = document.getElementById('nombre-paciente');
   const listaAntecedentes = document.getElementById('lista-antecedentes');
  const formulario = document.querySelector('.formulario-antecedente');
  const textareaNota = document.getElementById('nueva-nota');

  inputBusqueda.addEventListener('input', async () => {
    const termino = inputBusqueda.value.trim();
    listaPacientes.innerHTML = '';

    if (termino.length === 0) return;

    try {
      const res = await fetch(`http://localhost:3000/buscar-pacientes?nombre=${encodeURIComponent(termino)}`);
      const data = await res.json();

      if (data.status === 'success') {
        data.pacientes.forEach(p => {
          const li = document.createElement('li');
          li.textContent = `${p.nombre} (${p.usuario})`;
          li.addEventListener('click', () => {
            seleccionarPaciente(p);
          });
          listaPacientes.appendChild(li);
        });
      } else {
        listaPacientes.innerHTML = '<li>No se encontraron resultados</li>';
      }
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
    }
  });
});

function seleccionarPaciente(paciente) {
  pacienteSeleccionado = paciente;
  document.getElementById('nombre-paciente').textContent = paciente.nombre;
  document.getElementById('buscar-paciente-input').value = `${paciente.nombre}`;
  document.getElementById('lista-pacientes').innerHTML = '';
  cargarAntecedentes(paciente.id_usuario);
   document.querySelector('.paciente-info').style.display = 'block';
  document.querySelector('.antecedentes-lista').style.display = 'block';
  document.querySelector('.formulario-antecedente').style.display = 'block';

}

async function cargarAntecedentes(id_usuario) {
  const lista = document.getElementById('lista-antecedentes');
  lista.innerHTML = '';

  try {
    const res = await fetch(`http://localhost:3000/antecedentes/${id_usuario}`);
    const data = await res.json();

    if (data.status === 'success') {
      if (data.antecedentes.length === 0) {
        lista.innerHTML = '<li>No hay antecedentes registrados.</li>';
      } else {
       data.antecedentes.forEach(a => {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>${a.fecha.split('T')[0]} - ${a.nota}</span>
    <button onclick="eliminarAntecedente(${a.id_antecedente})" class="btn-eliminar">🗑️</button>
  `;
  lista.appendChild(li);
});

       

      }
    } else {
      lista.innerHTML = '<li>Error al cargar antecedentes.</li>';
    }
  } catch (error) {
    console.error('Error al cargar antecedentes:', error);
    lista.innerHTML = '<li>Error al cargar antecedentes.</li>';
  }
}
async function eliminarAntecedente(id) {
  if (!confirm('¿Estás seguro de eliminar esta nota?')) return;

  try {
    const res = await fetch(`http://localhost:3000/antecedentes/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (data.status === 'success') {
      cargarAntecedentes(pacienteSeleccionado.id_usuario);
    } else {
      alert('No se pudo eliminar el antecedente.');
    }
  } catch (error) {
    console.error('Error al eliminar antecedente:', error);
    alert('Error al conectar con el servidor.');
  }
}



async function agregarAntecedente() {
  const nota = document.getElementById('nueva-nota').value.trim();
  if (!pacienteSeleccionado || nota === '') {
    alert('Selecciona un paciente y escribe una nota.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/antecedentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: pacienteSeleccionado.id_usuario,
        detalle: nota
      })
    });

    const data = await res.json();

    if (data.status === 'success') {
      document.getElementById('nueva-nota').value = '';
      cargarAntecedentes(pacienteSeleccionado.id_usuario);
    } else {
      alert('Error al guardar la nota.');
    }
  } catch (error) {
    console.error('Error al guardar antecedente:', error);
    alert('Error al conectar con el servidor.');
  }
}
