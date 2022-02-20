import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { CachePolicies, IncomingOptions, Provider } from 'use-http';
import { useAuth } from './AuthContext';

interface IHttpInterceptorProviderProps {
  children: ReactNode;
}

export function HttpInterceptorProvider({
  children,
}: IHttpInterceptorProviderProps): JSX.Element {
  const { authenticated, token } = useAuth();
  const navigate = useNavigate();

  const optionsProvider = {
    cachePolicy: CachePolicies.NO_CACHE,
    interceptors: {
      request: ({ options, url }) => {
        if (authenticated) {
          if (!url?.includes('ibge') && !url?.includes('viacep')) {
            options.headers = {
              ...options.headers,
              authorization: `Bearer ${token}`,
            };
          }
        }
        return options;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response: ({ response }: any) => {
        const res = response;

        if (res.status === 401) navigate('/signout');

        return res;
      },
    },
  } as IncomingOptions;

  return (
    <Provider
      url={
        process.env.REACT_APP_NODE_ENV === 'production'
          ? process.env.REACT_APP_BACKEND_URL
          : process.env.REACT_APP_BACKEND_URL_DEV
      }
      options={optionsProvider}
    >
      {children}
    </Provider>
  );
}

export default HttpInterceptorProvider;
