import { Button, Container, Grid, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';

export function SignIn(): JSX.Element {
  document.title = 'Entrar | Lion';

  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const { handleLogin, authenticated } = useAuth();

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email('Campo deve ser um email')
      .required('Campo obrigatório'),
    password: Yup.string().required('Campo obrigatório'),
  });

  const signInForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async ({ username, password }) => {
      const loggedIn = await handleLogin(username, password);
      if (!loggedIn) setIncorrectPassword(true);
      else navigate('/');
    },
  });

  const handleChangeUsername = useCallback(
    ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      signInForm.setFieldValue('username', value);
      if (incorrectPassword) setIncorrectPassword(false);
    },
    [incorrectPassword, signInForm]
  );

  useEffect(() => {
    if (authenticated) navigate('/');
  }, [authenticated, navigate]);

  const handleChangePassword = useCallback(
    ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      signInForm.setFieldValue('password', value);
      if (incorrectPassword) setIncorrectPassword(false);
    },
    [incorrectPassword, signInForm]
  );

  return (
    <Container>
      <form onSubmit={signInForm.handleSubmit}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing="1rem"
          style={{ minHeight: 'calc(100vh - 110px)' }}
        >
          {incorrectPassword && (
            <Grid item>
              <span>Verifique as informações inseridas!</span>
            </Grid>
          )}

          <Grid item>
            {/* TODO: componentizar */}
            <TextField
              label="Usuário"
              onChange={handleChangeUsername}
              value={signInForm.values.username}
              style={{ minWidth: '280px' }}
              error={'username' in signInForm.errors}
              helperText={signInForm.errors['username']}
            />
          </Grid>

          <Grid item>
            <TextField
              type="password"
              label="Senha"
              onChange={handleChangePassword}
              value={signInForm.values.password}
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
