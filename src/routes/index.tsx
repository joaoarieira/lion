import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from '../components/RequireAuth';

const Home = lazy(() => import('../modules/Home'));
const SearchResults = lazy(
  () => import('../modules/Home/components/SearchResults')
);
const SignIn = lazy(() => import('../pages/SignIn'));
const SignOut = lazy(() => import('../pages/SignOut'));
const About = lazy(() => import('../pages/About'));
const Notices = lazy(() => import('../pages/Notices'));
const Campuses = lazy(() => import('../modules/Campuses'));
const Programs = lazy(() => import('../modules/Programs'));
const StudentTutoringTutorDetails = lazy(
  () => import('../pages/StudentTutoringTutorDetails')
);

export function AppRoutes(): JSX.Element {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="search" element={<SearchResults />} />
      <Route path="signin" element={<SignIn />} />
      <Route path="signout" element={<SignOut />} />
      <Route path="details/:id" element={<StudentTutoringTutorDetails />} />
      <Route path="about" element={<About />} />
      <Route path="notices" element={<Notices />} />

      <Route
        path="campuses"
        element={
          <RequireAuth>
            <Campuses />
          </RequireAuth>
        }
      />

      <Route
        path="programs"
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
