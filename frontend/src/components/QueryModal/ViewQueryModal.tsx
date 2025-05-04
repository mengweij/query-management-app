'use client';

import { Modal, Text, Button, Group, Badge, Divider, Box } from '@mantine/core';

interface ViewQueryModalProps {
    opened: boolean;
    onClose: () => void;
    question: string;
    status: 'OPEN' | 'RESOLVED';
    description: string;
    createdAt: string;
    updatedAt?: string;
    onResolve?: () => void;
}

export default function ViewQueryModal({ opened, onClose, question, status, description, createdAt, updatedAt, onResolve }: ViewQueryModalProps) {
    const isOpen = status === 'OPEN';

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            centered
            title={
                <Text size="lg" fw={700}>Manage Query</Text>
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
                        Created: {createdAt}
                        {updatedAt && <> &nbsp;|&nbsp; Updated: {updatedAt}</>}
                    </Text>
                </Group>
            </Box>
            <Divider my="sm" />
            <Box mb="md">
                <Text c="dimmed" size="sm" mb={2}>For Question</Text>
                <Text size="md" fw={500} mb="sm">{question}</Text>
                <Text c="dimmed" size="sm" mb={2}>Description</Text>
                <Text size="md" fw={500}>{description}</Text>
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