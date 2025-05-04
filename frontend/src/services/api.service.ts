import api from './api'
import { Query, CreateQueryDto } from '../types/query'
import { ApiResponse, FormDataResponse } from '../types/api'
import { isAxiosError } from 'axios'

async function handleRequest<T>(request: Promise<unknown>): Promise<T> {
  try {
    const response = (await request) as { data: T }
    return response.data
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data?.message || 'Server error'
    }
    throw `Request failed in API Service: ${error}`
  }
}

export const apiService = {
  formData: {
    getAll: () =>
      handleRequest<ApiResponse<FormDataResponse>>(api.get('/form-data')),
  },

  query: {
    create: (data: CreateQueryDto) =>
      handleRequest<Query>(api.post('/queries', data)),
    updateStatus: (id: string, status: 'RESOLVED') =>
      handleRequest<Query>(api.patch(`/queries/${id}`, { status })),
    delete: (id: string) => handleRequest<void>(api.delete(`/queries/${id}`)),
  },
}

export default apiService
