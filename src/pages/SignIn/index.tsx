import { Button, Container, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

export function SignIn(): JSX.Element {
  document.title = 'Entrar | Lion';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { handleLogin } = useAuth();

  const navigate = useNavigate();

  async function handleSignInButton(): Promise<void> {
    handleLogin(username, password);
    navigate('/');
  }

  return (
    <Container>
      <form onSubmit={handleSignInButton}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing="1rem"
          style={{ minHeight: 'calc(100vh - 110px)' }}
        >
          <Grid item>
            <TextField
              label="Usuário"
              onChange={({ target: { value } }) => setUsername(value)}
              value={username}
              style={{ minWidth: '280px' }}
            />
          </Grid>
          <Grid item>
            <TextField
              type="password"
              label="Senha"
              onChange={({ target: { value } }) => setPassword(value)}
              value={password}
              style={{ minWidth: '280px' }}
            />
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained">
              Entrar
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SignIn;
