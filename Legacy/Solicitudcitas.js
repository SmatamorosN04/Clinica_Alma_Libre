const calendarGrid = document.getElementById('calendar-grid');
const monthDisplay = document.getElementById('month-display');
const modal = document.getElementById('modal');
const timeOption = document.getElementById('time-options');
const horaCita = document.getElementById('hora-cita');
const fechaCita = document.getElementById('fecha-cita');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');

const date = new Date();
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Mostrar el calendario inicial
function updateCalendar() {
    // Mostrar el mes y el año actuales
    monthDisplay.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    // Limpiar el calendario actual
    calendarGrid.innerHTML = '';

    // Obtener el número de días del mes actual
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    // Crear los días dinámicamente
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), i); // Día específico
        const dayOfWeek = weekDays[currentDate.getDay()]; // Día de la semana

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        dayDiv.textContent = `${dayOfWeek} ${i}`;
        dayDiv.addEventListener('click', () => openModal(i));
        calendarGrid.appendChild(dayDiv);
    }
}
//Funcion para solicitar Cita
function enviarCita() {
    const hora = document.getElementById('hora-cita').textContent;
    const fecha = document.getElementById('fecha-cita').textContent;

    if (!hora || !fecha || hora === "00:00" || fecha === "00/00/00") {
        alert('Por favor, seleccione una fecha y hora antes de continuar.');
        return;
    }

    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        alert('Debe iniciar sesión para agendar una cita.');
        return;
    }

    // Formatear la fecha (de DD/MM/YYYY a YYYY-MM-DD)
    const partesFecha = fecha.split('/');
    const fechaFormato = `${partesFecha[2]}-${partesFecha[1].padStart(2, '0')}-${partesFecha[0].padStart(2, '0')}`;

    // Convertir hora a formato 24 horas
    let [horaPartes, periodo] = hora.split(/(AM|PM)/);
    let [horaNum, minutos] = horaPartes.split(':');
    if (periodo === 'PM' && horaNum !== '12') horaNum = parseInt(horaNum) + 12;
    if (periodo === 'AM' && horaNum === '12') horaNum = '00';

    const horaFormato = `${horaNum.toString().padStart(2, '0')}:${minutos}:00`;

    // Enviar datos al backend
    fetch('http://localhost:3000/agendar-cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: usuario,
            fecha: fechaFormato,
            hora: horaFormato
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            alert('✅ Cita agendada correctamente');
            // Redirigir al historial
            window.location.href = 'historialcitas.html';
        } else {
            alert(' Error: ' + (data.message || 'No se pudo agendar la cita.'));
        }
    })
    .catch(err => {
        console.error('Error al agendar cita:', err);
        alert(' Error de red al intentar agendar cita.');
    });
}


// Botón para enviar la cita


// Navegar al mes anterior
prevMonthButton.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    updateCalendar();
});

// Navegar al mes siguiente
nextMonthButton.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    updateCalendar();
});

// Abrir el modal al seleccionar un día
function openModal(day) {
    modal.style.display = 'flex';
    timeOption.innerHTML = '';
    ['9:00AM', '10:00AM', '11:00AM', '2:00PM', '3:00PM', '4:00PM'].forEach(hour => {
        const li = document.createElement('li');
        li.textContent = hour;
        li.addEventListener('click', () => selectTime(day, hour));
        timeOption.appendChild(li);
    });
}

// Seleccionar hora y cerrar el modal
function selectTime(day, hour) {
    fechaCita.textContent = `${day}/${date.getMonth() + 1}/${date.getFullYear()}`;
    horaCita.textContent = hour;
    closeModal();
}

// Cerrar el modal
function closeModal() {
    modal.style.display = 'none';
}

// Inicializar el calendario
updateCalendar();
window.onload = () => {
   document.getElementById('solicitar-cita').addEventListener('click', enviarCita);
};
