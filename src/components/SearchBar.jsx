import React from 'react'
import { TextInput, Button, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom';


const SearchBar = () => {
  const navigate = useNavigate();
  return (
  <Group gap = "sm" justify = "center">
  <TextInput placeholder = "Search for a trip" w = "50%"/>
  <Button onClick={() => navigate("/tripFilter")}> Go </Button>
  </Group>
  )
}

export default SearchBar
