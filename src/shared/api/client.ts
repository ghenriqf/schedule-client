import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@App:token')
      window.location.href = '/login'
    }

    if (!error.response) {
      console.error('Servidor indisponível')
    }

    return Promise.reject(error)
  },
)

export { client }