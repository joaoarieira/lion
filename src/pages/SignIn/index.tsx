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
    <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
      <Link to="/">Home</Link>
      <input
        type="text"
        placeholder="Usuário"
        onChange={({ target: { value } }) => setUsername(value)}
        value={username}
      />
      <input
        type="password"
        placeholder="Senha"
        onChange={({ target: { value } }) => setPassword(value)}
        value={password}
      />
      <button type="button" onClick={handleSignInButton}>
        Entrar
      </button>
    </div>
  );
}

export default SignIn;
