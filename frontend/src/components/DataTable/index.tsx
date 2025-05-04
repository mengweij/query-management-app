'use client'

import { Table } from '@mantine/core'
import { useState } from 'react'

import QueryCell from './queryCell'
import CreateQueryModal from '../QueryModal/CreateQueryModal'
import ViewQueryModal from '../QueryModal/ViewQueryModal'
import mockData from '../mockData'

export default function DataTable() {
  const [createQueryModal, setCreateQueryModal] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [viewQueryModal, setViewQueryModal] = useState(false)
  const [currentQuery, setCurrentQuery] = useState<any>(null)

  const handleCreateQuery = (row: any) => {
    setCurrentQuestion(row.question)
    setCreateQueryModal(true)
  }

  const handleSubmit = (description: string) => {
    // TODO: replace with API call
    alert(`Submitted query for ${currentQuestion}: ${description}`)
    setCreateQueryModal(false)
  }

  const handleViewQuery = (row: any) => {
    setCurrentQuestion(row.question)
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
          {mockData.map(row => (
            <Table.Tr key={row.id}>
              <Table.Td>{row.question}</Table.Td>
              <Table.Td>{row.answer}</Table.Td>
              <Table.Td>
                <QueryCell
                  status={
                    row.query ? (row.query.status as 'OPEN' | 'RESOLVED') : null
                  }
                  onCreateQuery={() => handleCreateQuery(row)}
                  onViewQuery={() => handleViewQuery(row)}
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
          setCurrentQuestion('')
        }}
        question={currentQuestion}
        onSubmit={handleSubmit}
      />
      <ViewQueryModal
        opened={viewQueryModal}
        onClose={() => {
          setViewQueryModal(false)
          setCurrentQuery(null)
          setCurrentQuestion('')
        }}
        question={currentQuestion}
        status={currentQuery?.status}
        description={currentQuery?.description}
        createdAt={currentQuery?.createdAt}
        updatedAt={currentQuery?.updatedAt}
        onResolve={handleResolveQuery}
      />
    </>
  )
}
