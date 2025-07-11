import { FormData } from './form_data'

export interface ApiResponse<T> {
  statusCode: number
  data: T
  message: string
}

export interface FormDataResponse {
  total: number
  formData: FormData[]
}
