'use client'

import { Table } from '@mantine/core'
import { useEffect, useState } from 'react'
import { notifications } from '@mantine/notifications'
import { IconX, IconCheck } from '@tabler/icons-react'

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

      notifications.show({
        title: 'Success!',
        message: `Created query for ${currentFormData?.question}`,
        icon: <IconCheck />,
        color: 'green',
      })

      await fetchFormData()
    } catch (error) {
      console.error('Error creating query:', error)
      notifications.show({
        title: 'Error!',
        message: 'Error creating query',
        icon: <IconX />,
        color: 'red',
      })
    } finally {
      setCreateQueryModal(false)
      setCurrentFormData(null)
    }
  }

  const handleViewQuery = (row: FormData) => {
    setCurrentFormData(row)
    setViewQueryModal(true)
  }

  const handleResolveQuery = async () => {
    if (!currentFormData?.query) {
      console.error('Current form data has no query to resolve')
      return
    }

    try {
      await apiService.query.updateStatus(currentFormData.query.id, 'RESOLVED')

      notifications.show({
        title: 'Success!',
        message: `Resolved query for ${currentFormData?.question}`,
        icon: <IconCheck />,
        color: 'green',
      })

      await fetchFormData()
    } catch (error) {
      console.error('Error resolving query:', error)

      notifications.show({
        title: 'Error!',
        message: 'Error resolving query',
        icon: <IconX />,
        color: 'red',
      })
    } finally {
      setViewQueryModal(false)
      setCurrentFormData(null)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Table.ScrollContainer minWidth={600} maxHeight={'calc(90vh - 200px)'}>
        <Table highlightOnHover withTableBorder stickyHeader>
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
                      row.query
                        ? (row.query.status as 'OPEN' | 'RESOLVED')
                        : null
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
      </Table.ScrollContainer>
      <CreateQueryModal
        opened={createQueryModal}
        onClose={() => {
          setCreateQueryModal(false)
          setCurrentFormData(null)
        }}
        question={currentFormData?.question || ''}
        onSubmit={handleSubmit}
      />

      {currentFormData?.query && (
        <ViewQueryModal
          opened={viewQueryModal}
          onClose={() => {
            setViewQueryModal(false)
            setCurrentFormData(null)
          }}
          question={currentFormData.question}
          status={currentFormData.query.status}
          description={currentFormData.query.description || ''}
          createdAt={currentFormData.query.createdAt}
          updatedAt={currentFormData.query.updatedAt}
          onResolve={handleResolveQuery}
        />
      )}
    </>
  )
}
