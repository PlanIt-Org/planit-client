import { Box, Stack, Text } from '@mantine/core'
import React from 'react'


const SuggestedTrip = () => {
  return (
    <Box  style={{
        border: '1px solid #ccc',
        padding: '12px',
        borderRadius: '8px'
      }}>
      <Stack>
        <Text>title</Text>
        <Text>location 1, locaiton 2, location 3</Text>
      </Stack>
    </Box>
  )
}

export default SuggestedTrip;