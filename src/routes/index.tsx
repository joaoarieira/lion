import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentTutorings from '../modules/StudentTutorings';
import StudentTutoringTutors from '../modules/StudentTutoringTutors';
import Users from '../modules/Users';

const RequireAuth = lazy(() => import('../components/RequireAuth'));
const Home = lazy(() => import('../modules/Home'));
const SearchResults = lazy(
  () => import('../modules/Home/components/SearchResults')
);
const SignIn = lazy(() => import('../pages/SignIn'));
const SignOut = lazy(() => import('../pages/SignOut'));
const About = lazy(() => import('../pages/About'));
const Notices = lazy(() => import('../pages/Notices'));
const Campuses = lazy(() => import('../modules/Campuses/pages/Campuses'));
const Campus = lazy(() => import('../modules/Campuses/pages/Campus'));
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
        path="campuses/:id"
        element={
          <RequireAuth>
            <Campus />
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

      <Route
        path="users"
        element={
          <RequireAuth>
            <Users />
          </RequireAuth>
        }
      />

      <Route
        path="student-tutorings"
        element={
          <RequireAuth>
            <StudentTutorings />
          </RequireAuth>
        }
      />

      <Route
        path="student-tutoring-tutors"
        element={
          <RequireAuth>
            <StudentTutoringTutors />
          </RequireAuth>
        }
      />

      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default AppRoutes;
