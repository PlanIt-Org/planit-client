import React from 'react'
import { TextInput, Button, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom';


const HomeLocationSearchBar = () => {
  const navigate = useNavigate();
  return (
  <Group gap = "sm" justify = "center" mb={42}>
  <TextInput placeholder = "Search for a location (ex: San Francisco)" w = "50%" size="lg"/>
  <Button onClick={() => navigate("/tripFilter")} size="lg">Go</Button>
  </Group>
  )
}

export default HomeLocationSearchBar
