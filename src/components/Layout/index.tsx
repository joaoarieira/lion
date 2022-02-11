import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Select,
  MenuItem,
  Container,
  Button,
} from '@mui/material';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import {
  Page,
  StyledDrawer,
  Logo,
  StyledAppBar,
  StyledToolbar,
  Filler,
  LogoIconButton,
  CampusSelectContainer,
  WelcomeContainer,
  ToolbarWrapper,
} from './styles';
import {
  HomeOutlined,
  InfoOutlined,
  LocationOnOutlined,
  MenuBookOutlined,
  MenuOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { grey } from '@mui/material/colors';
import lionImg from '../../assets/lion.png';

interface ILayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: ILayoutProps): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { authenticated } = useAuth();

  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      setIsDrawerOpen(false);
    },
    [navigate]
  );

  const menuItems = useMemo(
    () => [
      {
        text: 'Página inicial',
        icon: <HomeOutlined />,
        path: '/',
      },
      {
        text: 'Editais',
        icon: <MenuBookOutlined />,
        path: '/notices',
      },
      {
        text: 'Sobre',
        icon: <InfoOutlined />,
        path: '/about',
      },
    ],
    []
  );

  return (
    <div>
      <StyledAppBar>
        <ToolbarWrapper>
          <StyledToolbar>
            <Filler />
            <LogoIconButton
              size="large"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => handleNavigate('/')}
            >
              <Logo src={lionImg} />
            </LogoIconButton>

            <Button
              color="inherit"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <MenuOutlined />
            </Button>
          </StyledToolbar>
        </ToolbarWrapper>
      </StyledAppBar>

      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <CampusSelectContainer>
          <LocationOnOutlined
            style={{
              fontSize: '24px',
              marginRight: '0.5rem',
              color: grey[700],
            }}
          />
          <Select style={{ width: '100%', height: '40px' }} defaultValue={1}>
            <MenuItem value={1}>Rio Paranaíba</MenuItem>
            <MenuItem value={2}>Viçosa</MenuItem>
            <MenuItem value={3}>Florestal</MenuItem>
          </Select>
        </CampusSelectContainer>

        <WelcomeContainer>
          <Typography
            variant="h5"
            component="p"
            width="0px"
            marginTop="2.5rem"
            marginLeft="1rem"
          >
            Bem vindo(a).
          </Typography>

          <Typography
            variant="body1"
            marginTop="3rem"
            marginBottom="5rem"
            fontStyle="italic"
            fontSize="1.125rem"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              handleNavigate(!authenticated ? '/signin' : '/signout')
            }
          >
            {!authenticated ? 'Entrar' : 'Sair'}
          </Typography>
        </WelcomeContainer>

        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              style={{
                borderRight: '4px solid',
                borderColor:
                  location.pathname === item.path ? grey[700] : 'transparent',
              }}
            >
              <ListItemIcon style={{ minWidth: '2.25rem' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: '18px' }}
                primary={item.text}
              />
            </ListItemButton>
          ))}
        </List>
      </StyledDrawer>

      <Page>
        <Container>{children}</Container>
      </Page>
    </div>
  );
};
