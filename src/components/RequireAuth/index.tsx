import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/AuthContext';

interface IRequireAuthProps {
  children: JSX.Element;
}

export function RequireAuth({ children }: IRequireAuthProps): JSX.Element {
  const { authenticated } = useAuth();
  const location = useLocation();

  console.log(authenticated);

  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
