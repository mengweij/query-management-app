import { Query } from '@prisma/client'

export interface IFormData {
  id: string
  question: string
  answer: string
  query: Query | null
}

export interface ICountedFormData {
  total: number
  formData: IFormData[]
}
