import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Text,
  Box,
  Group,
  Stack,
  Title,
  Container,
  Grid,
  ThemeIcon,
  Card,
  Image,
  Anchor,
} from "@mantine/core";
import { motion } from "framer-motion";
import {
  IconMapPin,
  IconCalendarEvent,
  IconUsers,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import classes from "../styles/LandingPage.module.css";
import ThreeCanvas from "../components/ThreeCanvas";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const teamMembers = [
  {
    id: 1,
    name: "Joshua Cesar Pierre",
    college: "University of Texas at Austin",
    image: "/assets/E7T5PNK3P-U08SV91JELA-69ffacaca526-512.jpg",
    linkedin: "https://www.linkedin.com/in/joshua-cesar-pierre-13624327a/",
  },
  {
    id: 2,
    name: "Thomas Sibilly",
    college: "Columbia University",
    image: "/assets/E7T5PNK3P-U08SD3V9AK1-182c630cdade-512.jpg",
    linkedin: "https://www.linkedin.com/in/thomas-sibilly/",
  },
  {
    id: 3,
    name: "Moosay Hailewold",
    college: "University of Maryland",
    image: "/assets/E7T5PNK3P-U08SCVAKE3Z-cd93d749916d-512.jpg",
    linkedin: "https://www.linkedin.com/in/moosay/",
  },
];

const FeatureGrid = () => {
  const features = [
    {
      icon: <IconCalendarEvent size={28} />,
      title: "Coordinate Schedules",
      description:
        "Easily find the best date that works for everyone in your group.",
    },
    {
      icon: <IconMapPin size={28} />,
      title: "Discover Locations",
      description: "Browse other users trips and get AI recommended locations.",
    },
    {
      icon: <IconUsers size={28} />,
      title: "Collaborate Simply",
      description:
        "One central place for your trip's itinerary, guest list, and conversations.",
    },
  ];
  return (
    <Container size="lg" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <Title order={2} c="white" style={{ fontSize: 42 }} ta="center">
          How It Works
        </Title>
      </motion.div>
      <Grid gutter="xl" mt="xl">
        {features.map((feature, index) => (
          <Grid.Col span={{ base: 12, md: 4 }} key={feature.title}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Stack align="center" ta="center">
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                  size={60}
                  radius="xl"
                >
                  {feature.icon}
                </ThemeIcon>
                <Text fw={700} fz="xl" mt="md" c="white">
                  {feature.title}
                </Text>
                <Text c="dimmed">{feature.description}</Text>
              </Stack>
            </motion.div>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

const MeetOurTeam = () => {
  return (
    <Container size="xl" py="xl">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
      >
        <Title order={2} ta="center" mb="xl" c="white" style={{ fontSize: 42 }}>
          Meet Our Team
        </Title>
      </motion.div>
      <Grid justify="center" align="stretch">
        {teamMembers.map((member, index) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={member.id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{ height: "100%" }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#1A1B1E",
                }}
              >
                <Card.Section>
                  <Image
                    src={member.image}
                    alt={member.name}
                    height={250}
                    fit="cover"
                  />
                </Card.Section>
                <Stack
                  mt="md"
                  style={{ flexGrow: 1, justifyContent: "space-between" }}
                >
                  <Box>
                    <Title order={3} size="h4" fw={700} c="white" mb="xs">
                      {member.name}
                    </Title>
                    <Text size="sm" c="dimmed">
                      {member.college}
                    </Text>
                  </Box>
                  <Group>
                    <Anchor
                      href={member.linkedin}
                      target="_blank"
                      c="dimmed"
                      underline="never"
                    >
                      <IconBrandLinkedin size={24} />
                    </Anchor>
                  </Group>
                </Stack>
              </Card>
            </motion.div>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const learnMoreRef = useRef(null);

  const handleScrollToLearnMore = () => {
    learnMoreRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box className={classes.pageWrapper}>
      <Box className={classes.heroSection}>
        <ThreeCanvas />

        <motion.header
          className={classes.header}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Group justify="space-between" align="center">
            <Text style={{ fontSize: 36 }} fw={700} c="white">
              PlanIt
            </Text>
            <Button
              variant="outline"
              color="gray"
              size="md"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </Group>
        </motion.header>

        <Container size="md" className={classes.heroContent}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack align="center" ta="center">
              <motion.div variants={itemVariants}>
                <Text c="dimmed" fw={700} mb={0}>
                  EVERY TRIP MADE EASY, JUST PLANIT.
                </Text>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Title
                  order={1}
                  className={classes.titleGradient}
                  style={{
                    fontSize: "clamp(2.5rem, 7vw, 78px)",
                    lineHeight: 1.1,
                    maxWidth: 800,
                  }}
                >
                  Planning a hangout has never been easier.
                </Title>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Group mt="xl" justify="center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="default"
                      size="xl"
                      radius="md"
                      onClick={handleScrollToLearnMore}
                    >
                      Find out More
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="gradient"
                      gradient={{ from: "indigo", to: "cyan" }}
                      size="xl"
                      radius="md"
                      onClick={() => navigate("/register")}
                    >
                      Plan a Trip
                    </Button>
                  </motion.div>
                </Group>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Box ref={learnMoreRef} className={classes.learnMoreSection}>
        <FeatureGrid />
        <MeetOurTeam />
      </Box>
    </Box>
  );
};

export default LandingPage;
