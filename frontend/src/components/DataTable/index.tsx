'use client'

import { Table } from '@mantine/core'
import mockData from '../mockData'

export default function DataTable() {
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
              {/* TODO: modify this after integrating query component */}
              {row.query ? row.query.status : ''}
            </Table.Td>
          </Table.Tr>
        ))}
            </Table.Tbody>
        </Table>
    )
}