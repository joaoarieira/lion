import { Button, Container, Grid, TextField } from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <Link to="/">Home</Link>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing="1rem"
        style={{ minHeight: '100vh' }}
      >
        <Grid item>
          <TextField
            label="Usuário"
            onChange={({ target: { value } }) => setUsername(value)}
            value={username}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            type="password"
            label="Senha"
            onChange={({ target: { value } }) => setPassword(value)}
            value={password}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSignInButton} fullWidth>
            Entrar
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SignIn;
