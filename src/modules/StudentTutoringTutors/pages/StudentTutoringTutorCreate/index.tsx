import { Box, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { IStudentTutoring, IUser } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { FormSelect } from '../../../../components/FormSelect';

interface IStudentTutoringTutorCreateValues {
  student_tutoring_id: string;
  tutor_id: string;
  professor_id: string;
}

export function StudentTutoringTutorCreate(): JSX.Element {
  document.title = 'Monitores | Lion';

  const [studentTutorings, setStudentTutorings] = useState<IStudentTutoring[]>(
    []
  );
  const [professors, setProfessors] = useState<IUser[]>([]);
  const [tutors, setTutors] = useState<IUser[]>([]);

  const { authenticated, userAuthenticated } = useAuth();
  const {
    post: postStudentTutoringTutor,
    response: responseStudentTutoringTutor,
    loading: loadingStudentTutoringTutor,
  } = useFetch('/student-tutoring-tutors');
  const {
    get: getUsers,
    response: responseUsers,
    loading: loadingUsers,
  } = useFetch('/users');
  const {
    get: getStudentTutorings,
    response: responseStudentTutorings,
    loading: loadingStudentTutorings,
  } = useFetch('/student-tutorings');

  const validationSchema = Yup.object().shape({
    student_tutoring_id: Yup.string().required('Monitoria é obrigatória'),
    professor_id: Yup.string().required('Professor é obrigatório'),
    tutor_id: Yup.string().required('Monitor é obrigatório'),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      student_tutoring_id: '',
      professor_id: '',
      tutor_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createStudentTutoringTutor(values);
    },
  });

  const fetchUsersData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getUsers();

        if (responseUsers.ok) {
          setProfessors(
            (responseUsers.data as IUser[]).filter(
              (user) => user.role?.name === roleNames.professor
            )
          );
          setTutors(
            (responseUsers.data as IUser[]).filter(
              (user) => user.role?.name === roleNames.student_tutor
            )
          );
        } else {
          toast.error(
            'Falha ao obter os dados dos monitores e professores. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, getUsers, responseUsers, userAuthenticated.role]);

  const fetchStudentTutoringsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getStudentTutorings();

        if (responseStudentTutorings.ok) {
          setStudentTutorings(responseStudentTutorings.data);
        } else {
          toast.error(
            'Falha ao obter os dados das monitorias. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [
    authenticated,
    getStudentTutorings,
    responseStudentTutorings,
    userAuthenticated.role,
  ]);

  const createStudentTutoringTutor = useCallback(
    async (values: IStudentTutoringTutorCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await postStudentTutoringTutor(values);

          if (responseStudentTutoringTutor.ok) {
            createForm.resetForm();
            toast.success(
              'Monitor e professor vinculados à monitoria com sucesso.'
            );
          } else {
            toast.error(
              'Falha vincular estes usuários à monitoria. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      createForm,
      postStudentTutoringTutor,
      responseStudentTutoringTutor.ok,
      userAuthenticated.role,
    ]
  );

  useEffect(() => {
    fetchStudentTutoringsData();
    fetchUsersData();
  }, [fetchStudentTutoringsData, fetchUsersData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Vincular monitor" />

      <FormPaper>
        <form onSubmit={createForm.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="student_tutoring_id"
                label="Monitoria"
                value={createForm.values.student_tutoring_id}
                disabled={loadingStudentTutorings}
                fullWidth
              >
                {studentTutorings.map((studentTutoring) => (
                  <MenuItem key={studentTutoring.id} value={studentTutoring.id}>
                    {studentTutoring.course_name}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="professor_id"
                label="Professor supervisor"
                value={createForm.values.professor_id}
                disabled={loadingUsers}
                fullWidth
              >
                {professors.map((professor) => (
                  <MenuItem key={professor.id} value={professor.id}>
                    {professor.name}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="tutor_id"
                label="Estudante monitor"
                value={createForm.values.tutor_id}
                disabled={loadingUsers}
                fullWidth
              >
                {tutors.map((tutor) => (
                  <MenuItem key={tutor.id} value={tutor.id}>
                    {tutor.name}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loadingStudentTutoringTutor} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default StudentTutoringTutorCreate;
