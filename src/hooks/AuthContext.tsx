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
import useFetch, { CachePolicies } from 'use-http';
import jwt_decode from 'jwt-decode';

interface IJwtDecodedInfos {
  sub: string; // id do usuário
  username: string;
  userrole: string;
}

interface IUser {
  id: string;
  name: string;
  role: string;
}

interface IAuthProviderProps {
  children: ReactNode;
}

interface IAuthContextData {
  authenticated: boolean;
  token?: string;
  userAuthenticated: IUser;
  handleLogin: (username: string, password: string) => Promise<boolean>;
  handleLogout: () => void;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider = ({
  children,
}: IAuthProviderProps): ReactElement => {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [userAuthenticated, setUserAuthenticated] = useState<IUser>({
    id: '',
    name: '',
    role: '',
  });

  const navigate = useNavigate();

  const { post, response } = useFetch(
    process.env.REACT_APP_NODE_ENV === 'production'
      ? process.env.REACT_APP_BACKEND_URL
      : process.env.REACT_APP_BACKEND_URL_DEV,
    {
      suspense: true,
      cachePolicy: CachePolicies.NO_CACHE,
    }
  );

  const handleLogin = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      await post('/auth/login', { username, password });

      if (response.ok) {
        setAuthenticated(true);
        setToken(response.data.access_token);

        const jwtDecoded = jwt_decode(
          response.data.access_token
        ) as IJwtDecodedInfos;

        setUserAuthenticated({
          id: jwtDecoded.sub,
          name: jwtDecoded.username,
          role: jwtDecoded.userrole,
        });

        localStorage.setItem(
          '@Lion:token',
          JSON.stringify(response.data.access_token)
        );
      } else {
        setAuthenticated(false);
        localStorage.removeItem('@Lion:token');
        console.error(response);
        if (response.status === undefined || response.status >= 500) {
          toast.error('Ocorreu um erro interno ao logar. Tente mais tarde.');
        }
      }
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
      const jwtDecoded = jwt_decode(newToken) as IJwtDecodedInfos;

      setAuthenticated(true);
      setToken(newToken);
      setUserAuthenticated({
        id: jwtDecoded.sub,
        name: jwtDecoded.username,
        role: jwtDecoded.userrole,
      });
    }
  }, []);

  useEffect(() => {
    getTokenFromLocalStorage();
  }, [getTokenFromLocalStorage]);

  const memoizedContextValue = useMemo<IAuthContextData>(
    () => ({
      authenticated,
      token,
      userAuthenticated,
      handleLogin,
      handleLogout,
    }),
    [authenticated, token, userAuthenticated, handleLogin, handleLogout]
  );

  // if (loading) {
  //   return <div>Carregando...</div>;
  // }

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
