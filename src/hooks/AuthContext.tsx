import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

interface IAuthProviderProps {
  children: ReactNode;
}

interface IAuthContextData {
  authenticated: boolean;
  token?: string;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider = ({
  children,
}: IAuthProviderProps): ReactElement => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { post, response } = useFetch(process.env.REACT_APP_BACKEND_URL, {
    suspense: true,
  });

  const handleLogin = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      setLoading(true);
      await post('/auth/login', { username, password });

      if (response.ok) {
        setAuthenticated(true);
        setToken(response.data.access_token.toString());
        localStorage.setItem(
          '@Lion:token',
          JSON.stringify(response.data.access_token)
        );
      } else {
        setAuthenticated(false);
        localStorage.setItem('@Lion:token', '');
        console.error(response);
        if (response.status === undefined || response.status >= 500) {
          toast.error('Ocorreu um erro interno ao logar. Tente mais tarde.');
        }
      }
      setLoading(false);
      return response.ok ?? false;
    },
    [post, response]
  );

  const handleLogout = useCallback(() => {
    setAuthenticated(false);
    localStorage.removeItem('@Lion:token');
    navigate('/');
  }, [navigate]);

  const getTokenFromLocalStorage = useCallback(() => {
    const tokenLocalStorage = localStorage.getItem('@Lion:token');
    if (tokenLocalStorage) {
      const newToken = JSON.parse(tokenLocalStorage);
      setAuthenticated(true);
      setToken(newToken);
    }
  }, []);

  useEffect(() => {
    getTokenFromLocalStorage();
  }, [getTokenFromLocalStorage]);

  const memoizedContextValue = useMemo<IAuthContextData>(
    () => ({
      authenticated,
      handleLogin,
      handleLogout,
      token,
    }),
    [authenticated, handleLogin, handleLogout, token]
  );

  if (loading) {
    // return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={memoizedContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContextData => {
  return useContext(AuthContext);
};

export default AuthProvider;
