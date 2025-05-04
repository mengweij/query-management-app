'use client'

import { Table } from '@mantine/core'
import { useEffect, useState } from 'react'

import QueryCell from './queryCell'
import CreateQueryModal from '../QueryModal/CreateQueryModal'
import ViewQueryModal from '../QueryModal/ViewQueryModal'
import apiService from '../../services/api.service'
import { FormData } from '../../types/form_data'

export default function DataTable() {
  const [formData, setFormData] = useState<FormData[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const [createQueryModal, setCreateQueryModal] = useState(false)
  const [currentFormData, setCurrentFormData] = useState<FormData | null>(null)
  const [viewQueryModal, setViewQueryModal] = useState(false)
  const [currentQuery, setCurrentQuery] = useState<any>(null)

  useEffect(() => {
    fetchFormData()
  }, [])

  const fetchFormData = async () => {
    try {
      setLoading(true)
      const response = await apiService.formData.getAll()
      if (response.statusCode !== 200) {
        console.error('Error fetching form data:', response.message)
        return
      }
      const { formData } = response.data
      setFormData(formData)
    } catch (error) {
      console.error('Error fetching form data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateQuery = (row: FormData) => {
    setCurrentFormData(row)
    setCreateQueryModal(true)
  }

  const handleSubmit = async (description: string) => {
    if (!currentFormData) {
      console.error('No current form data to create a query for')
      return
    }

    try {
      await apiService.query.create({
        title: currentFormData.question,
        description,
        formDataId: currentFormData.id,
      })

      alert(`Created query for ${currentFormData?.question}`)

      await fetchFormData()
    } catch (error) {
      console.error('Error creating query:', error)
      alert('Error creating query')
    } finally {
      setCreateQueryModal(false)
      setCurrentFormData(null)
    }
  }

  const handleViewQuery = (row: FormData) => {
    setCurrentFormData(row)
    if (row.query) {
      setCurrentQuery({
        status: row.query.status,
        description: row.query.description || 'No description provided',
        createdAt: row.query.createdAt,
        updatedAt: row.query.updatedAt,
      })
      setViewQueryModal(true)
    }
  }

  const handleResolveQuery = () => {
    // TODO: replace with API call
    alert(`Resolved query for ${currentQuery?.title}`)
    setViewQueryModal(false)
    setCurrentQuery(null)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Question</Table.Th>
            <Table.Th>Answer</Table.Th>
            <Table.Th>Queries</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {formData.map(row => (
            <Table.Tr
              key={row.id}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              <Table.Td>{row.question}</Table.Td>
              <Table.Td>{row.answer}</Table.Td>
              <Table.Td>
                <QueryCell
                  status={
                    row.query ? (row.query.status as 'OPEN' | 'RESOLVED') : null
                  }
                  onCreateQuery={() => handleCreateQuery(row)}
                  onViewQuery={() => handleViewQuery(row)}
                  isHovered={hoveredRowId === row.id}
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <CreateQueryModal
        opened={createQueryModal}
        onClose={() => {
          setCreateQueryModal(false)
          setCurrentFormData(null)
        }}
        question={currentFormData?.question || ''}
        onSubmit={handleSubmit}
      />
      <ViewQueryModal
        opened={viewQueryModal}
        onClose={() => {
          setViewQueryModal(false)
          setCurrentQuery(null)
          setCurrentFormData(null)
        }}
        question={currentFormData?.question || ''}
        status={currentQuery?.status}
        description={currentQuery?.description}
        createdAt={currentQuery?.createdAt}
        updatedAt={currentQuery?.updatedAt}
        onResolve={handleResolveQuery}
      />
    </>
  )
}
