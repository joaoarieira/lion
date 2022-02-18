import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import StudentTutoringTutors from '../modules/StudentTutoringTutors';

const RequireAuth = lazy(() => import('../components/RequireAuth'));
const Home = lazy(() => import('../modules/Home'));
const SearchResults = lazy(
  () => import('../modules/Home/components/SearchResults')
);
const SignIn = lazy(() => import('../pages/SignIn'));
const SignOut = lazy(() => import('../pages/SignOut'));
const About = lazy(() => import('../pages/About'));
const Notices = lazy(() => import('../pages/Notices'));
const CampusesList = lazy(
  () => import('../modules/Campuses/pages/CampusesList')
);
const CampusEdit = lazy(() => import('../modules/Campuses/pages/CampusEdit'));
const CampusCreate = lazy(
  () => import('../modules/Campuses/pages/CampusCreate')
);
const ProgramsList = lazy(
  () => import('../modules/Programs/pages/ProgramsList')
);
const ProgramEdit = lazy(() => import('../modules/Programs/pages/ProgramEdit'));
const ProgramCreate = lazy(
  () => import('../modules/Programs/pages/ProgramCreate')
);
const StudentTutoringTutorDetails = lazy(
  () => import('../pages/StudentTutoringTutorDetails')
);
const UsersList = lazy(() => import('../modules/Users/pages/UsersList'));
const UserCreate = lazy(() => import('../modules/Users/pages/UserCreate'));
const UserEdit = lazy(() => import('../modules/Users/pages/UserEdit'));
const StudentTutoringsList = lazy(
  () => import('../modules/StudentTutorings/pages/StudentTutoringsList')
);
const StudentTutoringCreate = lazy(
  () => import('../modules/StudentTutorings/pages/StudentTutoringCreate')
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
            <CampusesList />
          </RequireAuth>
        }
      />
      <Route
        path="campuses/:id"
        element={
          <RequireAuth>
            <CampusEdit />
          </RequireAuth>
        }
      />
      <Route
        path="campuses/new"
        element={
          <RequireAuth>
            <CampusCreate />
          </RequireAuth>
        }
      />

      <Route
        path="programs"
        element={
          <RequireAuth>
            <ProgramsList />
          </RequireAuth>
        }
      />
      <Route
        path="programs/:id"
        element={
          <RequireAuth>
            <ProgramEdit />
          </RequireAuth>
        }
      />
      <Route
        path="programs/new"
        element={
          <RequireAuth>
            <ProgramCreate />
          </RequireAuth>
        }
      />

      <Route
        path="users"
        element={
          <RequireAuth>
            <UsersList />
          </RequireAuth>
        }
      />
      <Route
        path="users/:id"
        element={
          <RequireAuth>
            <UserEdit />
          </RequireAuth>
        }
      />
      <Route
        path="users/new"
        element={
          <RequireAuth>
            <UserCreate />
          </RequireAuth>
        }
      />

      <Route
        path="student-tutorings"
        element={
          <RequireAuth>
            <StudentTutoringsList />
          </RequireAuth>
        }
      />
      <Route
        path="student-tutorings/:id"
        element={
          <RequireAuth>
            <StudentTutoringsList />
          </RequireAuth>
        }
      />
      <Route
        path="student-tutorings/new"
        element={
          <RequireAuth>
            <StudentTutoringCreate />
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
