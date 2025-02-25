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
