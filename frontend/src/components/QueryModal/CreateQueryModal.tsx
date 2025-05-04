'use client'

import { Modal, Textarea, Button, Group, Text, Divider } from '@mantine/core'
import { useState } from 'react'

interface CreateQueryModalProps {
  opened: boolean
  onClose: () => void
  question: string
  onSubmit: (description: string) => void
}

export default function CreateQueryModal({
  opened,
  onClose,
  question,
  onSubmit,
}: CreateQueryModalProps) {
  const [description, setDescription] = useState('')

  const handleSubmit = () => {
    onSubmit(description)
    setDescription('')
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Text size="lg" fw={500}>
        Create a Query | {question}
      </Text>
      <Divider my="md" />
      <Textarea
        placeholder="Enter query description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        minRows={4}
        size="md"
        radius="md"
      />
      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!description.trim()}
        >
          Submit
        </Button>
      </Group>
    </Modal>
  )
}
