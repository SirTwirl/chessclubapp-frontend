import { api } from './client'

const baseUrl = '/login'

const login = async credentials => {
  const response = await api.post(baseUrl, credentials)
  return response.data
}

export default { login }