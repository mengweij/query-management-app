'use client'

import { Table } from '@mantine/core'
import QueryCell from './queryCell'
import mockData from '../mockData'

export default function DataTable() {
    const handleCreateQuery = (row: any) => {
        // TODO: replace with modal component
        alert(`Create Query for ${row.question}`);
    }

    const handleViewQuery = (row: any) => {
        // TODO: replace with modal component
        alert(`View Query for ${row.question}`);
    }

    return (
        <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Question</Table.Th>
          <Table.Th>Answer</Table.Th>
          <Table.Th>Queries</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {mockData.map((row) => (
          <Table.Tr key={row.id}>
            <Table.Td>{row.question}</Table.Td>
            <Table.Td>{row.answer}</Table.Td>
            <Table.Td>
              <QueryCell
                status={row.query ? (row.query.status as 'OPEN' | 'RESOLVED') : null}
                onCreateQuery={() => handleCreateQuery(row)}
                onViewQuery={() => handleViewQuery(row)}
              />
            </Table.Td>
          </Table.Tr>
        ))}
            </Table.Tbody>
        </Table>
    )
}