import React from 'react';
import {
  Card,
  Image,
  Text,
  Group,
  Stack,
  Anchor, // For links
  Box,    // For spacing/layout
  Title,  // For names
  Grid,   // To arrange cards in a grid
  Container
} from '@mantine/core';
import { IconBrandLinkedin, IconLink } from '@tabler/icons-react'; // Icons for LinkedIn and general link

const teamMembers = [
  {
    id: 1,
    name: 'Joshua Cesar Pierre',
    college: 'University of Texas at Austin',
    image: 'https://i.pravatar.cc/150?img=68', // Placeholder image
    linkedin: 'https://www.linkedin.com/in/joshua-cesar-pierre-13624327a/',
  },
  {
    id: 2,
    name: 'Thomas Sibily',
    college: 'Columbia University',
    image: 'https://i.pravatar.cc/150?img=47', // Placeholder image
    linkedin: 'https://www.linkedin.com/in/thomas-sibilly/',
  },
  {
    id: 3,
    name: 'Moosay Hailewold',
    college: 'University of Maryland',
    image: 'https://i.pravatar.cc/150?img=12', // Placeholder image
    linkedin: 'https://www.linkedin.com/in/moosay/',
  },
];

const MeetOurTeam = () => {
  return (
    <Container size="xl" py="xl"> {/* Container for overall spacing */}
      <Title order={2} ta="center" mb="xl">
        Meet Our Team
      </Title>
      <Grid justify="center" align="stretch"> {/* Use Grid to arrange cards */}
        {teamMembers.map((member) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={member.id}> {/* Responsive columns */}
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }} // Ensure cards stretch and content is column-stacked
            >
              {/* Top Half: Picture */}
              <Card.Section>
                <Image
                  src={member.image}
                  alt={member.name}
                  height={200} // Fixed height for the image
                  fit="cover"
                />
              </Card.Section>

              {/* Bottom Half: Name, College, Links */}
              <Stack mt="md" style={{ flexGrow: 1, justifyContent: 'space-between' }}> {/* Stack for vertical arrangement */}
                <Box> {/* Group name and college */}
                  <Title order={3} size="h4" fw={700} mb="xs">
                    {member.name}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {member.college}
                  </Text>
                </Box>

                <Stack spacing="xs" mt="md"> {/* Stack for links */}
                  {member.linkedin && (
                    <Anchor href={member.linkedin} target="_blank" rel="noopener noreferrer" size="sm">
                      <Group gap="xs">
                        <IconBrandLinkedin size={18} />
                        <Text>LinkedIn</Text>
                      </Group>
                    </Anchor>
                  )}
                  {member.portfolio && (
                    <Anchor href={member.portfolio} target="_blank" rel="noopener noreferrer" size="sm">
                      <Group gap="xs">
                        <IconLink size={18} />
                        <Text>Portfolio</Text>
                      </Group>
                    </Anchor>
                  )}
                  {member.github && (
                    <Anchor href={member.github} target="_blank" rel="noopener noreferrer" size="sm">
                      <Group gap="xs">
                        <IconLink size={18} /> {/* Using generic link icon for GitHub, or you can import IconBrandGithub */}
                        <Text>GitHub</Text>
                      </Group>
                    </Anchor>
                  )}
                  {member.website && (
                    <Anchor href={member.website} target="_blank" rel="noopener noreferrer" size="sm">
                      <Group gap="xs">
                        <IconLink size={18} />
                        <Text>Website</Text>
                      </Group>
                    </Anchor>
                  )}
                </Stack>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default MeetOurTeam;