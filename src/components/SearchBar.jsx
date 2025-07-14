import React from 'react'
import { TextInput, Button, Group } from '@mantine/core'



const SearchBar = () => {
  return (
  <Group gap = "sm" justify = "center">
  <TextInput placeholder = "Search for a trip" w = "50%"/>
  <Button> Go </Button>
  </Group>
  )
}

export default SearchBar
