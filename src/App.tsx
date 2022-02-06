import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import HttpInterceptorProvider from './hooks/HttpInterceptorProvider';
import Routes from './routes';
import { Layout } from './components/Layout';

const AuthProvider = lazy(() => import('./hooks/AuthContext'));

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<div>Carregando...</div>}>
        <AuthProvider>
          <HttpInterceptorProvider>
            <Layout>
              <Routes />
            </Layout>
          </HttpInterceptorProvider>
          <ToastContainer />
        </AuthProvider>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
