import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome2,
  IconUser,
  IconCompass,
  IconHeart,
} from "@tabler/icons-react";
import {
  Center,
  Stack,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { useMediaQuery } from "@mantine/hooks";
import classes from "../styles/NavBarMinimal.module.css";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Tooltip
      label={label}
      position={isMobile ? "top" : "right"}
      transitionProps={{ duration: 0 }}
    >
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        style={{
          width: isMobile ? "100%" : "50px",
          height: isMobile ? "40px" : "50px",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "4px" : "0",
        }}
      >
        {Icon && <Icon size={isMobile ? 18 : 20} stroke={1.5} />}
        {isMobile && (
          <span style={{ fontSize: "10px", lineHeight: 1 }}>{label}</span>
        )}
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", path: "/home" },
  { icon: IconCompass, label: "Discover", path: "/discover" },
  { icon: IconHeart, label: "Saved", path: "/saved" },
  { icon: IconUser, label: "Profile", path: "/profile" },
  // { icon: IconFingerprint, label: 'Security' },
];

function NavBar({ currentPage, setLocations }) {
  const [active, setActive] = useState(currentPage); // default to home
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);

        if (index === 0) {
          setLocations([]);
        }
        navigate(link.path);
      }}
    />
  ));

  return (
    <nav
      className={classes.navbar}
      style={{
        width: isMobile ? "100%" : "80px",
        height: isMobile ? "60px" : "auto",
        flexDirection: isMobile ? "row" : "column",
        padding: isMobile ? "8px" : "var(--mantine-spacing-md)",
        borderTop: isMobile ? "none" : "none",
        borderRight: isMobile
          ? "none"
          : "1px solid var(--mantine-color-gray-3)",
        borderBottom: isMobile
          ? "1px solid var(--mantine-color-gray-3)"
          : "none",
      }}
    >
      {!isMobile && (
        <Center>
          <MantineLogo
            type="mark"
            size={30}
            onClick={() => {
              navigate("/");
            }}
            style={{ cursor: "pointer" }}
          />
        </Center>
      )}

      <div
        className={classes.navbarMain}
        style={{
          marginTop: isMobile ? "0" : "50px",
          flexDirection: isMobile ? "row" : "column",
        }}
      >
        <Stack
          justify="center"
          gap={0}
          style={{
            flexDirection: isMobile ? "row" : "column",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {links}
        </Stack>
      </div>

      {/* <Stack justify="center" gap={0}>
        {/* <NavbarLink icon={IconSwitchHorizontal} label="Change account" /> *
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack> */}
    </nav>
  );
}

export default NavBar;
