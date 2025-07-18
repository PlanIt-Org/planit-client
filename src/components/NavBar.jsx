import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconHome2,
  IconUser,
  IconCompass,
  IconHeart,
} from "@tabler/icons-react";
import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "../styles/NavBarMinimal.module.css";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        {Icon && <Icon size={20} stroke={1.5} />}
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

function NavBar({ currentPage }) {
  const [active, setActive] = useState(currentPage); // default to home
  const navigate = useNavigate();

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index); // update local state
        navigate(link.path); // navigate
      }}
    />
  ));

  return (
    <nav className={classes.navbar}>
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

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
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
