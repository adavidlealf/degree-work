document.addEventListener("DOMContentLoaded", () => {

    /**
     * Referencias HTML
     */
    // Formulario de subir archivo
    const uploadForm = document.querySelector('#uploadForm');
    // Boton de subir archivo
    const fileInput = document.querySelector('#fileInput');

    // Tabla de columnas
    const tableDescrip = document.querySelector('#columns-description');

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
            const response = await fetch('http://localhost:3000/upload/session', {
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

    // FUNCIONES
    const generarInfoCols = (data) => {
        if(tableDescrip) {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            
            // Crear la fila de encabezado
            const headerRow = document.createElement('tr');
            const headers = ["NOMBRE DE COLUMNA", "DEFINICIÓN", "OBLIGATORIA"];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

             // Crear las filas del cuerpo
            data.forEach(item => {
                const row = document.createElement('tr');

                const columnCell = document.createElement('td');
                columnCell.textContent = item.column;
                row.appendChild(columnCell);

                const definitionCell = document.createElement('td');
                definitionCell.textContent = item.definition;
                row.appendChild(definitionCell);

                const requiredCell = document.createElement('td');
                requiredCell.textContent = item.required;
                row.appendChild(requiredCell);

                tbody.appendChild(row);
            });

            // Agregar thead y tbody a la tabla
            table.appendChild(thead);
            table.appendChild(tbody);

            // Agregar la tabla al contenedor en el DOM
            tableDescrip.appendChild(table);
        }
    };

    const inicio = () => {
        fetch('../info-columns/sessionCols.json')
        .then(response => {
            if(!response.ok) {
                throw new Error('Error al cargar el archivo sessionCols.json')
            }
            return response.json();
        }). then(data => {
            generarInfoCols(data);
        }). catch(err => {
            console.error('Hubo un problema al cargar los datos session:', err);
        })
    }

    inicio();
})