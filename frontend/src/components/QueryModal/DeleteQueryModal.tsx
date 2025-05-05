'use client'

import { Modal, Text, Button } from '@mantine/core'

export default function DeleteQueryModal({
  opened,
  onClose,
  onConfirm,
}: {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text size="lg" fw={700}>
          Delete Query
        </Text>
      }
    >
      <Text size="sm" mb="md">
        Are you sure you want to delete this query? This action cannot be
        undone.
      </Text>
      <Button
        variant="filled"
        color="red"
        onClick={() => {
          onConfirm()
          onClose()
        }}
      >
        Delete Query
      </Button>
    </Modal>
  )
}
