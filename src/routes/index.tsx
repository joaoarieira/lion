import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../components/RequireAuth';

const Home = lazy(() => import('../modules/Home'));
const SignIn = lazy(() => import('../pages/SignIn'));
const SignOut = lazy(() => import('../pages/SignOut'));

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signout" element={<SignOut />} />

      <Route
        path="/private"
        element={
          <RequireAuth>
            <h1>Private</h1>
          </RequireAuth>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default AppRoutes;
