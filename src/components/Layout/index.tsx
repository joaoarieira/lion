import {
  List,
  Typography,
  Select,
  MenuItem,
  Container,
  Button,
  Divider,
} from '@mui/material';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
  AccountBalance,
  AssignmentIndOutlined,
  ChevronLeftOutlined,
  HistoryEduOutlined,
  HomeOutlined,
  InfoOutlined,
  LocationOnOutlined,
  MenuBookOutlined,
  MenuOutlined,
  PersonOutline,
  SchoolOutlined,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import { grey } from '@mui/material/colors';
import lionImg from '../../assets/lion.png';
import { roleNames } from '../../helpers';
import MenuListItem, { IItem } from '../MenuListItem';
import useFetch from 'use-http';
import { ICampus } from '../../@types/entities';
import { toast } from 'react-toastify';

interface ILayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: ILayoutProps): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [campuses, setCampuses] = useState<ICampus[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const { authenticated, userAuthenticated } = useAuth();
  const { get, response } = useFetch('/campuses');

  const fetchCampusesData = useCallback(async () => {
    await get();

    if (response.ok) {
      setCampuses(response.data);
    } else {
      toast.error('Falha ao obter os dados dos campi.');
    }
  }, [get, response]);

  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      setIsDrawerOpen(false);
    },
    [navigate]
  );

  const menuItems: IItem[] = useMemo(
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

  const adminMenuItems: IItem[] = useMemo(
    () => [
      {
        text: 'Campi',
        icon: <AccountBalance />,
        path: '/campuses',
      },
      {
        text: 'Cursos',
        icon: <SchoolOutlined />,
        path: '/programs',
      },
      {
        text: 'Usuários',
        icon: <PersonOutline />,
        path: '/users',
      },
      {
        text: 'Monitorias',
        icon: <HistoryEduOutlined />,
        path: '/student-tutorings',
      },
      {
        text: 'Monitores',
        icon: <AssignmentIndOutlined />,
        path: '/student-tutoring-tutors',
      },
    ],
    []
  );

  const studentTutorMenuItems: IItem[] = useMemo(
    () => [
      {
        text: 'Minhas monitorias',
        icon: <HistoryEduOutlined />,
        path: '/my-student-tutorings',
      },
    ],
    []
  );

  useEffect(() => {
    fetchCampusesData();
  }, [fetchCampusesData]);

  return (
    <div>
      <StyledAppBar>
        <ToolbarWrapper>
          <StyledToolbar>
            {location.pathname === '/' ? (
              <Filler />
            ) : (
              <Button color="inherit" onClick={() => navigate(-1)}>
                <ChevronLeftOutlined />
              </Button>
            )}

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
          <Select style={{ width: '100%', height: '40px' }} defaultValue="">
            {/* TODO: colocar o campus escolhido no localStorage */}
            {campuses.map((campus) => (
              <MenuItem key={campus.id} value={campus.id}>
                {campus.name}
              </MenuItem>
            ))}
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
            <MenuListItem
              key={item.text}
              item={item}
              handleNavigate={handleNavigate}
            />
          ))}

          {authenticated && userAuthenticated.role === roleNames.admin && (
            <>
              <Divider />
              {adminMenuItems.map((item) => (
                <MenuListItem
                  key={item.text}
                  item={item}
                  handleNavigate={handleNavigate}
                />
              ))}
            </>
          )}

          {authenticated && userAuthenticated.role === roleNames.student_tutor && (
            <>
              <Divider />
              {studentTutorMenuItems.map((item) => (
                <MenuListItem
                  key={item.text}
                  item={item}
                  handleNavigate={handleNavigate}
                />
              ))}
            </>
          )}
        </List>
      </StyledDrawer>

      <Page>
        <Container sx={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
          {children}
        </Container>
      </Page>
    </div>
  );
};
