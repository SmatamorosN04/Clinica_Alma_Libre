let videosData = []; // Aquí guardamos los videos que llegan del backend
function obtenerVistaPrevia(url) {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = url.match(youtubeRegex);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return `
      <iframe width="100%" height="100%"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0" allowfullscreen></iframe>`;
  }

  // TikTok
  const tiktokRegex = /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/.+\/video\/(\d+)/;
  const ttMatch = url.match(tiktokRegex);
  if (ttMatch) {
    const videoUrl = url.split('?')[0];
    return `
      <blockquote class="tiktok-embed"
        cite="${videoUrl}"
        data-video-id="${ttMatch[1]}"
        style="max-width: 100%; min-width: 300px;">
        <section>Loading TikTok...</section>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>`;
  }

  // Otros casos
  return `<p>Formato de video no soportado</p>`;
}

// Función para renderizar la lista de videos
function renderVideos(videos) {
    const videoList = document.getElementById("video-list");
    videoList.innerHTML = ""; // Limpiar lista de videos

    videos.forEach(video => {
        const videoItem = document.createElement("div");
          videoItem.classList.add("video-item");
        
       videoItem.innerHTML = `
  <h3 class="video-title">${video.title || video.titulo}</h3>
  <div class="video-frame">
    ${obtenerVistaPrevia(video.url)}
  </div>
  <div class="video-description">
    ${video.descripcion || 'Sin descripción'}
  </div>
`;

        videoList.appendChild(videoItem);
    });
}

// Función para ordenar videos por título alfabéticamente
function sortByTitle() {
    const sortedVideos = [...videosData].sort((a, b) => (a.title || a.titulo).localeCompare(b.title || b.titulo));
    renderVideos(sortedVideos);
}

// Función para ordenar videos por fecha de subida
function sortByUploadDate() {
    const sortedVideos = [...videosData].sort((a, b) => new Date(b.uploadDate || b.fecha_subida) - new Date(a.uploadDate || a.fecha_subida));
    renderVideos(sortedVideos);
}

// Función para buscar videos por título
function searchVideos() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredVideos = videosData.filter(video => (video.title || video.titulo).toLowerCase().includes(searchTerm));
    renderVideos(filteredVideos);
}

// Función para cargar videos desde backend
async function cargarVideos() {
    try {
        const res = await fetch('http://localhost:3000/videos'); // Ajusta URL si es distinta
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        if(data.status === 'success' && Array.isArray(data.videos)) {
            videosData = data.videos;
            renderVideos(videosData);
        } else {
            alert('Error al cargar los videos');
        }
    } catch (error) {
        console.error('Error al obtener videos:', error);
        alert('No se pudieron cargar los videos');
    }
}

// Evento para cargar videos cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
    cargarVideos();

    // Opcional: si tienes inputs y botones para búsqueda y ordenación, agrega sus listeners aquí.
    const searchInput = document.getElementById("search-input");
    if(searchInput) {
        searchInput.addEventListener("input", searchVideos);
    }

    const sortTitleBtn = document.getElementById("sort-title-btn");
    if(sortTitleBtn) {
        sortTitleBtn.addEventListener("click", sortByTitle);
    }

    const sortDateBtn = document.getElementById("sort-date-btn");
    if(sortDateBtn) {
        sortDateBtn.addEventListener("click", sortByUploadDate);
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