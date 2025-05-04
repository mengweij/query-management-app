'use client'

import {
  Modal,
  Text,
  Button,
  Group,
  Badge,
  Divider,
  Box,
  Tooltip,
} from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function formatDisplayDate(date: string) {
  if (Date.now() - new Date(date).getTime() < 7 * 24 * 60 * 60 * 1000) {
    return dayjs(date).fromNow()
  }
  return formatFullDate(date)
}

function formatFullDate(date: string) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

interface ViewQueryModalProps {
  opened: boolean
  onClose: () => void
  question: string
  status: 'OPEN' | 'RESOLVED'
  description: string
  createdAt: string
  updatedAt?: string
  onResolve?: () => void
}

export default function ViewQueryModal({
  opened,
  onClose,
  question,
  status,
  description,
  createdAt,
  updatedAt,
  onResolve,
}: ViewQueryModalProps) {
  const isOpen = status === 'OPEN'
  const hasUpdatedAfterCreated = updatedAt !== createdAt

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text size="lg" fw={700}>
          Manage Query
        </Text>
      }
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Box mb="xs">
        <Group justify="flex-start">
          <Badge color={isOpen ? 'red' : 'green'} size="md">
            {isOpen ? 'OPEN' : 'RESOLVED'}
          </Badge>
          <Text size="sm" c="dimmed">
            <Tooltip label={formatFullDate(createdAt)} withArrow>
              <span>Created: {formatDisplayDate(createdAt)}</span>
            </Tooltip>
            {updatedAt && hasUpdatedAfterCreated && (
              <>
                &nbsp;|&nbsp;
                <Tooltip label={formatFullDate(updatedAt)} withArrow>
                  <span>Updated: {formatDisplayDate(updatedAt)}</span>
                </Tooltip>
              </>
            )}
          </Text>
        </Group>
      </Box>
      <Divider my="sm" />
      <Box mb="md">
        <Text c="dimmed" size="sm" mb={2}>
          For Question
        </Text>
        <Text size="md" fw={500} mb="sm">
          {question}
        </Text>
        <Text c="dimmed" size="sm" mb={2}>
          Description
        </Text>
        <Text size="md" fw={500}>
          {description}
        </Text>
      </Box>
      {isOpen && (
        <Group justify="center" mt="md">
          <Button color="green" onClick={onResolve}>
            Resolve
          </Button>
        </Group>
      )}
    </Modal>
  )
}
