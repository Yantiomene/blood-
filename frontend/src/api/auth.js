import axios from 'axios';
axios.defaults.withCredentials = true;

export async function onRegistration(data) {
    const response = await axios.post(
        'http://localhost:8000/api/register', 
        data
    );
    return response;
}

export async function onLogin(data) {
    const response = await axios.post(
        'http://localhost:8000/api/login', 
        data
    );
    return response;
}

export async function onLogout() {
    const response = await axios.get(
        'http://localhost:8000/api/logout'
    );
    return response;
}

export async function fetchProtectedInfo() {
    const response = await axios.get(
        'http://localhost:8000/api/protected'
    );
    return response;
}
