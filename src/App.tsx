import AuthProvider from './hooks/AuthContext';
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

const Routes = lazy(() => import('./routes'));
const HttpInterceptorProvider = lazy(
  () => import('./hooks/HttpInterceptorProvider')
);

function App(): JSX.Element {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AuthProvider>
        <HttpInterceptorProvider>
          <Routes />
        </HttpInterceptorProvider>
        <ToastContainer />
      </AuthProvider>
    </Suspense>
  );
}

export default App;
