import { styled, Drawer, AppBar, Toolbar, IconButton } from '@mui/material';

const drawerWidth = '275px';

export const Page = styled('div')({
  width: '100%',
});

export const StyledDrawer = styled(Drawer, { name: 'StyledDrawer' })`
  width: ${drawerWidth};
  padding: 0.75rem;

  .MuiPaper-root {
    width: ${drawerWidth};
    padding: 0.75rem;
  }
`;

export const Logo = styled('img', { name: 'Logo' })`
  height: 80px;
`;

export const StyledAppBar = styled(AppBar, { name: 'StyledAppBar' })`
  background-color: transparent;
  box-shadow: none;
  position: static;
`;

export const StyledToolbar = styled(Toolbar, { name: 'StyledToolBar' })`
  background-color: transparent;
  color: black;
  justify-content: space-between;
`;

export const Filler = styled('span')`
  width: 70px;
`;

export const LogoIconButton = styled(IconButton, { name: 'LogoIconButton' })`
  padding: 22px 0 0 0;
  color: inherit;

  &:hover {
    background: none;
  }
`;

export const CampusSelectContainer = styled('div', {
  name: 'CampusSelectContainer',
})`
  display: flex;
  align-items: center;
`;

export const WelcomeContainer = styled('div', { name: 'WelcomeContainer' })`
  display: flex;
  justify-content: space-between;
`;
