import axios from 'axios'

export const BASE_URL = 'https://chessclubapp-backend.onrender.com/api'

export const api = axios.create({
  baseURL: BASE_URL,
})

let token = null

export const setToken = newToken => {
  if (newToken) {
    token = `Bearer ${newToken}`
  } else {
    token = null
  }
}

api.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = token
  }
  return config
})