document.addEventListener("DOMContentLoaded", () => {

    /**
     * Referencias HTML
     */
    // Formulario de subir archivo
    const uploadForm = document.querySelector('#uploadForm');
    // Boton de subir archivo
    const fileInput = document.querySelector('#fileInput');

    /**
     * EVENTOS
     */

    uploadForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor selecciona un archivo xlsx');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload/curriculum', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert('Archivo subido correctamente');
            } else {
                alert('Error al subir el archivo');
            }
            console.log(response.status);
            console.log(response.json);
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }
    });
})