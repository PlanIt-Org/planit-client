import React from 'react'
import { Container, Grid, Box } from '@mantine/core'
import TripCard from './TripCard'
const TripGrid = () => {
  return (
    <Container size="xl" py="lg">
      <Grid gutter="md" rowGap = "xl" columnGap = "xl">
       
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4}}>
          <TripCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
          <TripCard />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default TripGrid
