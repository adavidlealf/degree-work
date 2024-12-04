import { io } from "https://cdn.socket.io/4.5.4/socket.io.esm.min.js";

const socket = io('http://localhost:3000'); // Cambia el puerto si es necesario

// Escuchar logs
socket.on('log', (message) => {
    console.log('Log recibido:', message);
    const logContainer = document.getElementById('log-container');
    if (logContainer) {
        logContainer.innerHTML += `<p>${message}</p>`;
    }
});

// Escuchar progreso
socket.on('progress', (progress) => {
    console.log('Progreso recibido:', progress);
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
        progressBar.textContent = `${Math.round(progress)}%`;
    }
});

console.log("Archivo scriptSocket.js cargado correctamente");