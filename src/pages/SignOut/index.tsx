import { useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';

export function SignOut(): JSX.Element {
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return (
    <span>
      <h1>Signing Out...</h1>
    </span>
  );
}

export default SignOut;
