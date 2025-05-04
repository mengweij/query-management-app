import { Container, Title, Box, Text, Paper, Center } from '@mantine/core'
import DataTable from '../components/DataTable'

export default function Home() {
  return (
    <Container fluid mt="md" mb="xl">
      <Center mb="xl">
        <Box>
          <Title order={1} mt="xs" mb="xs">
            Query Management System
          </Title>
          <Text c="dimmed" mt="md" mb="md" ta={'center'}>
            Manage and track all queries in one place.
          </Text>
        </Box>
      </Center>

      <Paper shadow="sm" p="md" radius="md">
        <DataTable />
      </Paper>
    </Container>
  )
}
