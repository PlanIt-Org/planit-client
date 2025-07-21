import React from 'react'
import {
    Card,
    Stack,
    Text,
    Paper,
    Group,
    Avatar,
  } from '@mantine/core';

const TripGuestList = () => {
  return (
    <Card
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
                style={{
                  background: "#f3f4f6",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  textAlign: "center",
                }}
              >
                <Stack>
                  <Text>GUEST LIST: list of Invitees (PLACEHOLDER)</Text>
                  <Paper p="xs" withBorder>
                    <Group justify="center">
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=1`}
                        alt={"User 1"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=2`}
                        alt={"User 2"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=3`}
                        alt={"User 3"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=4`}
                        alt={"User 4"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=5`}
                        alt={"User 5"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=6`}
                        alt={"User 6"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=7`}
                        alt={"User 7"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=8`}
                        alt={"User 8"}
                      />
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=9`}
                        alt={"User 9"}
                      />
                    </Group>
                  </Paper>
                </Stack>
              </Card>
  )
}

export default TripGuestList