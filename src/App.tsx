import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material';
import { theme } from './styles/theme';
import 'react-toastify/dist/ReactToastify.min.css';
import HttpInterceptorProvider from './hooks/HttpInterceptorProvider';
import Routes from './routes';
import { Layout } from './components/Layout';
import AuthProvider from './hooks/AuthContext';
import { LoadingSuspense } from './components/LoadingSuspense';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingSuspense open />}>
        <AuthProvider>
          <HttpInterceptorProvider>
            <Layout>
              <Routes />
            </Layout>
          </HttpInterceptorProvider>
        </AuthProvider>
        <ToastContainer position="bottom-right" />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
