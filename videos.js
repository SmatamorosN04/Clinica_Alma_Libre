// Lista de videos que puedes actualizar agregando objetos con "title" y "url"
const videosData = [
    { title: "Video de Introducción", url: "https://www.youtube.com/embed/trRrCpsT0Eo", uploadDate: "2023-10-01" },
    { title: "Video Motivacional", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", uploadDate: "2023-10-15" },
    { title: "Terapia y Bienestar", url: "https://www.youtube.com/embed/2vjPBrBU-TM", uploadDate: "2023-09-10" }
];

// Función para renderizar la lista de videos
function renderVideos(videos) {
    const videoList = document.getElementById("videos-list");
    videoList.innerHTML = ""; // Limpiar lista de videos

    videos.forEach(video => {
        const videoItem = document.createElement("li");
        
        videoItem.innerHTML = `
            <h3>${video.title}</h3>
            <iframe width="560" height="315" src="${video.url}" 
                    title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <p>Fecha de subida: ${video.uploadDate}</p>
        `;
        videoList.appendChild(videoItem);
    });
}

// Función para ordenar videos por título alfabéticamente
function sortByTitle() {
    const sortedVideos = [...videosData].sort((a, b) => a.title.localeCompare(b.title));
    renderVideos(sortedVideos);
}

// Función para ordenar videos por fecha de subida
function sortByUploadDate() {
    const sortedVideos = [...videosData].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    renderVideos(sortedVideos);
}

// Función para buscar videos por título
function searchVideos() {
    const searchTerm = document.getElementById("search-input").value.toLowerCase();
    const filteredVideos = videosData.filter(video => video.title.toLowerCase().includes(searchTerm));
    renderVideos(filteredVideos);
}

// Renderizar videos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderVideos(videosData);
});
