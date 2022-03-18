import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
} from "@mui/material";
import { Link, Outlet, matchPath, useLocation } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LinkButton from "../component/LinkButton";
import MenuIcon from "@mui/icons-material/Menu";
import TwitarrAPI3 from "../../api/TwitarrAPI3";
import { useIsLoggedIn } from "../../recoil/APIAuthHooks";
import { useState } from "react";

const tabLinks: [string, string][] = [
  ["Tweets", "/tweets"],
  ["Forum", "/forum"],
  ["Seamail", "/seamail"],
  ["Schedule", "/schedule"],
];

const menuLinks: [string, string][] = [
  ["Home", "/"],
  ["Looking for Group", "/lfg"],
  ["Games", "/games"],
  ["Karaoke", "/karaoke"],
];

interface Props {}

export default function Layout(_: Props) {
  const isLoggedIn = useIsLoggedIn();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <MenuLinks />
          <TabLinks />
          {isLoggedIn ? (
            <Button color="inherit" onClick={() => TwitarrAPI3.logOut()}>
              Log out
            </Button>
          ) : (
            <LinkButton color="inherit" to="/login">
              Log in
            </LinkButton>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

// Helpers

function MenuLinks() {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const closeMenu = () => setMenuAnchorEl(null);
  const { pathname } = useLocation();

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={(event) => setMenuAnchorEl(event.currentTarget)}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={menuAnchorEl}
        open={menuAnchorEl != null}
        onClose={closeMenu}
      >
        {menuLinks.map(([label, path]) => (
          <MenuItem component={Link} key={path} onClick={closeMenu} to={path}>
            {matchPath(path, pathname) ? <strong>{label}</strong> : label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function TabLinks() {
  const selectedTab = useSelectedTab();

  return (
    <ThemeProvider
      theme={createTheme({ palette: { primary: { main: "#fff" } } })}
    >
      <Tabs
        sx={{ flexGrow: 1 }}
        textColor="inherit"
        value={selectedTab ?? false}
      >
        {tabLinks.map(([label, path]) => (
          <Tab
            component={Link}
            key={path}
            label={label}
            to={path}
            value={path}
          />
        ))}
      </Tabs>
    </ThemeProvider>
  );
}

// Hooks

function useSelectedTab(): string | undefined {
  const { pathname } = useLocation();

  const paths = tabLinks.map(([, path]) => path);
  return paths.find((p) => matchPath(p, pathname) != null);
}
