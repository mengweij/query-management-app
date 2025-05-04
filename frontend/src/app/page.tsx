'use client'

import {
  Title,
  Text,
  Paper,
  Center,
  AppShell,
} from '@mantine/core'
import DataTable from '../components/DataTable'

export default function Home() {
  return (
    <AppShell header={{ height: '120' }} padding="md" bg={'#f8f9fa'}>
      <AppShell.Header>
        <Center>
          <Title order={1} mt="xl" mb="xs">
            Query Management System
          </Title>
        </Center>
        <Text c="dimmed" mb="md" ta={'center'}>
          Manage and track all queries in one place.
        </Text>
      </AppShell.Header>

      <AppShell.Main>
        <Paper shadow="sm" p="md" radius="md">
          <DataTable />
        </Paper>
      </AppShell.Main>
    </AppShell>
  )
}
