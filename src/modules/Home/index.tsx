import { Link } from 'react-router-dom';
import useFetch from 'use-http';
import { useAuth } from '../../hooks/AuthContext';

export function Home(): JSX.Element {
  const { get, response } = useFetch('/users');

  const { authenticated } = useAuth();

  async function handleClick(): Promise<void> {
    await get();
    console.log(response.data);
  }

  return (
    <span>
      <h1>Home</h1>
      <h2>authenticated: {authenticated ? 'true' : 'false'}</h2>
      <button type="button" onClick={handleClick}>
        Get
      </button>
      <Link to="/signin">Sign in</Link>
      <Link to="/signout">Sign out</Link>
      <Link to="/private">Private</Link>
    </span>
  );
}

export default Home;
