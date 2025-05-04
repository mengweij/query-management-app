'use client'

import { ActionIcon, Tooltip, Group, Text } from '@mantine/core'
import { IconPlus, IconQuestionMark, IconCheck } from '@tabler/icons-react'

type QueryStatus = 'OPEN' | 'RESOLVED' | null

interface QueryCellProps {
  status: QueryStatus
  onCreateQuery: () => void
  onViewQuery: () => void
  isHovered: boolean
}

export default function QueryCell({
  status,
  onCreateQuery,
  onViewQuery,
  isHovered,
}: QueryCellProps) {
  if (!status) {
    return (
      <Group wrap="nowrap">
        {isHovered ? (
          <Tooltip label="Create Query" withArrow>
            <ActionIcon
              color="gray"
              variant="default"
              size="sm"
              onClick={onCreateQuery}
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>
        ) : (
          <Text size="sm" c="dimmed">
            No Query
          </Text>
        )}
      </Group>
    )
  }

  const isQueryOpen = status === 'OPEN'
  return (
    <Group wrap="nowrap" style={{ cursor: 'pointer' }} onClick={onViewQuery}>
      <Tooltip label={'View Query'} withArrow>
        <ActionIcon
          color={isQueryOpen ? 'red' : 'green'}
          variant="light"
          size="sm"
        >
          {isQueryOpen ? <IconQuestionMark /> : <IconCheck />}
        </ActionIcon>
      </Tooltip>
      <Text size="sm" fw={700} c={isQueryOpen ? 'red' : 'green'}>
        {isQueryOpen ? 'OPEN' : 'RESOLVED'}
      </Text>
    </Group>
  )
}
