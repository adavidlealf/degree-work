const PUERTO = '3000';
const HOST = `http://localhost:${PUERTO}/`;
const URL = 'campus'; //url del controlador de la api
const BULK = 'bulk'; //url del controlador de la api
const NAME = 'campus'; //nombre de la api

export const getAllCampuss = async () => {
    try {
        const resp = await fetch(`${HOST}${URL}`);
        return await resp.json();
    } catch (error) {
        console.error(`Error at getAll of ${NAME}: ${error}`);
        return error;
    }
}

export const getCampusById = async (id) => {
    try {
        const resp = await fetch(`${HOST}${URL}/${id}`);
        return await resp.json();
    } catch (error) {
        console.error(`Error at getById of ${NAME}: ${error}`);
        return error;
    }
};

export const createCampus = async (data) => {
    try {
        const resp = await fetch(`${HOST}${URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await resp.json();
    } catch (error) {
        console.error(`Error at create of ${NAME}: ${error}`);
        return error;
    }
};

export const createCampuss = async (data) => {
    try {
        const resp = await fetch(`${HOST}${URL}${BULK}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await resp.json();
    } catch (error) {
        console.error(`Error at massive create of ${NAME}: ${error}`);
        return error;
    }
};

export const updateCampus = async (id, data) => {
    try {
        const resp = await fetch(`${HOST}${URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await resp.json();
    } catch (error) {
        console.error(`Error at update of ${NAME}: ${error}`);
        return error;
    }
};

export const deleteCampusById = async (id) => {
    try {
        const resp = await fetch(`${HOST}${URL}/${id}`, {
            method: 'DELETE',
        });
        return await resp.json(); // Asume que la API devuelve una respuesta en JSON
    } catch (error) {
        console.error(`Error at delete of ${NAME}: ${error}`);
        return error;
    }
};

export const deleteCampuss = async () => {
    try {
        const resp = await fetch(`${HOST}${URL}`, {
            method: 'DELETE',
        });
        return await resp.json(); // Asume que la API devuelve una respuesta en JSON
    } catch (error) {
        console.error(`Error at massive delete of ${NAME}: ${error}`);
        return error;
    }
};