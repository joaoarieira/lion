import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../components/RequireAuth';
import { Campuses } from '../modules/Campuses';
import { Programs } from '../modules/Programs';

const Home = lazy(() => import('../pages/Home'));
const SignIn = lazy(() => import('../pages/SignIn'));
const SignOut = lazy(() => import('../pages/SignOut'));

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signout" element={<SignOut />} />

      <Route
        path="/campuses"
        element={
          <RequireAuth>
            <Campuses />
          </RequireAuth>
        }
      />

      <Route
        path="/programs"
        element={
          <RequireAuth>
            <Programs />
          </RequireAuth>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default AppRoutes;
