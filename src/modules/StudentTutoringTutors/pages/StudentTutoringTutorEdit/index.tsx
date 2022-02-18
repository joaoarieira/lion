import { Box, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import {
  IStudentTutoring,
  IStudentTutoringTutor,
  IUser,
} from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { FormSelect } from '../../../../components/FormSelect';
import { useParams } from 'react-router-dom';

interface IStudentTutoringTutorEditValues {
  student_tutoring_id: string;
  tutor_id: string;
  professor_id: string;
}

export function StudentTutoringTutorEdit(): JSX.Element {
  document.title = 'Monitores | Lion';

  const [loadComplete, setLoadComplete] = useState(false);
  const [professors, setProfessors] = useState<IUser[]>([]);
  const [tutors, setTutors] = useState<IUser[]>([]);
  const [studentTutorings, setStudentTutorings] = useState<IStudentTutoring[]>(
    []
  );
  const [studentTutoringTutor, setStudentTutoringTutor] = useState<
    IStudentTutoringTutor | undefined
  >();

  const { authenticated, userAuthenticated } = useAuth();
  const { id } = useParams();

  const {
    get: getStudentTutoringTutor,
    put: putStudentTutoringTutor,
    response: responseStudentTutoringTutor,
    loading: loadingStudentTutoringTutor,
  } = useFetch('/student-tutoring-tutors');
  const {
    get: getUsers,
    response: responseUsers,
    loading: loadingUsers,
  } = useFetch('/users');
  const { get: getStudentTutorings, response: responseStudentTutorings } =
    useFetch('/student-tutorings');

  const validationSchema = Yup.object().shape({
    student_tutoring_id: Yup.string().required('Monitoria é obrigatória'),
    professor_id: Yup.string().required('Professor é obrigatório'),
    tutor_id: Yup.string().required('Monitor é obrigatório'),
  });

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      student_tutoring_id: studentTutoringTutor?.student_tutoring_id ?? '',
      professor_id: studentTutoringTutor?.professor_id ?? '',
      tutor_id: studentTutoringTutor?.tutor_id ?? '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await editStudentTutoringTutor(values);
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

  const fetchStudentTutoringTutorData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getStudentTutoringTutor(id);

        if (responseStudentTutoringTutor.ok) {
          setStudentTutoringTutor(responseStudentTutoringTutor.data);
        } else {
          toast.error(
            'Falha ao obter os dados desta monitoria. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [
    authenticated,
    getStudentTutoringTutor,
    id,
    responseStudentTutoringTutor,
    userAuthenticated.role,
  ]);

  const editStudentTutoringTutor = useCallback(
    async (values: IStudentTutoringTutorEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await putStudentTutoringTutor(id, values);

          if (responseStudentTutoringTutor.ok) {
            editForm.resetForm();
            toast.success('Monitor e/ou professor alterados com sucesso.');
          } else {
            toast.error(
              'Falha ao editar os usuários desta monitoria. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      id,
      authenticated,
      editForm,
      putStudentTutoringTutor,
      responseStudentTutoringTutor.ok,
      userAuthenticated.role,
    ]
  );

  // TODO: consertar warnings dos selects

  useEffect(() => {
    fetchStudentTutoringTutorData();
    fetchStudentTutoringsData();
    fetchUsersData();
    setLoadComplete(true);
  }, [
    fetchStudentTutoringTutorData,
    fetchStudentTutoringsData,
    fetchUsersData,
  ]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Vincular monitor" />

      <FormPaper>
        <form onSubmit={editForm.handleSubmit}>
          {loadComplete && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormSelect
                  formAttributes={editForm}
                  name="student_tutoring_id"
                  label="Monitoria"
                  value={editForm.values.student_tutoring_id}
                  disabled
                  fullWidth
                >
                  {studentTutorings.map((studentTutoring) => (
                    <MenuItem
                      key={studentTutoring.id}
                      value={studentTutoring.id}
                    >
                      {studentTutoring.course_name}
                    </MenuItem>
                  ))}
                </FormSelect>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormSelect
                  formAttributes={editForm}
                  name="professor_id"
                  label="Professor supervisor"
                  value={editForm.values.professor_id}
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
                  formAttributes={editForm}
                  name="tutor_id"
                  label="Estudante monitor"
                  value={editForm.values.tutor_id}
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
          )}

          <FormFooter>
            <SaveButton type="submit" disabled={loadingStudentTutoringTutor} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default StudentTutoringTutorEdit;
