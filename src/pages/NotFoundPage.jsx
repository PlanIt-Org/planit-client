import { Button, Container, Group, Text, Title } from "@mantine/core";
import NotFoundIllustration from "../components/NotFoundIllustration";

const NotFoundPage = () => {
  return (
    <Container
      size={520}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          textAlign: "center",
          padding: "2rem",
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        }}
      >
        <NotFoundIllustration
          style={{
            width: 180,
            height: 72,
            margin: "0 auto 2rem auto",
            color: "#228be6",
          }}
        />
        <Title order={2} style={{ marginBottom: 12, fontWeight: 700 }}>
          Nothing to see here
        </Title>
        <Text c="dimmed" size="lg" ta="center" mb="xl">
          The page you are trying to open does not exist. You may have mistyped
          the address, or the page has been moved to another URL. If you think
          this is an error, contact support.
        </Text>
        <Group justify="center">
          <Button
            size="md"
            component="a"
            href="/home"
            color="blue"
            radius="md"
            style={{ fontWeight: 600 }}
          >
            Take me back to home page
          </Button>
        </Group>
      </div>
    </Container>
  );
};

export default NotFoundPage;
