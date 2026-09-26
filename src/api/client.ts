import axios from 'axios';

export const BASE_URL = 'https://chessclubapp-backend.onrender.com/api';

export const api = axios.create({
    baseURL : BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})