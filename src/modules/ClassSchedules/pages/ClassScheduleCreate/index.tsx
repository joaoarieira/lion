import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { CrudHeader } from '../../../../components/CrudHeader';
import { daysOfTheWeekOptions, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { useParams } from 'react-router-dom';
import { IStudentTutoringTutor } from '../../../../@types/entities';
import { FormSelect } from '../../../../components/FormSelect';

interface ClassScheduleCreateValues {
  student_tutoring_tutor_id: string;
  day_of_the_week: number;
  meeting_place: string;
  meeting_url?: string;
  note?: string;
  starts_at?: string;
  ends_at?: string;
}

export function ClassScheduleCreate(): JSX.Element {
  document.title = 'Campus | Lion';

  const [studentTutoringTutor, setStudentTutoringTutor] = useState<
    IStudentTutoringTutor | undefined
  >();

  const { id } = useParams();
  const { authenticated, userAuthenticated } = useAuth();

  const {
    post: postClassSchedule,
    response: responseClassSchedule,
    loading: loadingClassSchedule,
  } = useFetch('/class-schedules');
  const {
    get: getStudentTutoringTutor,
    response: responseStudentTutoringTutor,
  } = useFetch('/student-tutoring-tutors');

  const validationSchema = Yup.object().shape({
    student_tutoring_tutor_id: Yup.string(),
    day_of_the_week: Yup.number().required('Dia da semana é obrigatório'),
    meeting_place: Yup.string().required('Local de encontro é obrigatório'),
    meeting_url: Yup.string().min(10, 'URL curto demais'),
    note: Yup.string().min(5, 'Mínimo 5 caracteres'),
    starts_at: Yup.string().matches(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Digite no formato: HH:MM'
    ),
    ends_at: Yup.string().matches(
      /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
      'Digite no formato: HH:MM'
    ),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      student_tutoring_tutor_id: id ?? '-',
      day_of_the_week: 1,
      meeting_place: '',
      meeting_url: '',
      note: '',
      starts_at: '',
      ends_at: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createClassSchedule(values);
    },
  });

  const createClassSchedule = useCallback(
    async (values: ClassScheduleCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.student_tutor) {
          const preparedData = values;

          if (preparedData.ends_at === createForm.initialValues.ends_at)
            delete preparedData.ends_at;
          if (preparedData.starts_at === createForm.initialValues.starts_at)
            delete preparedData.starts_at;
          if (preparedData.meeting_url === createForm.initialValues.meeting_url)
            delete preparedData.meeting_url;
          if (preparedData.note === createForm.initialValues.note)
            delete preparedData.note;

          await postClassSchedule(preparedData);

          if (responseClassSchedule.ok) {
            createForm.resetForm();
            toast.success('Horário criado com sucesso.');
          } else {
            toast.error(
              'Falha ao criar novo horário. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      createForm,
      postClassSchedule,
      responseClassSchedule,
      userAuthenticated.role,
    ]
  );

  const fetchStudentTutoringTutorData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.student_tutor) {
        await getStudentTutoringTutor(id);

        if (responseStudentTutoringTutor.ok) {
          setStudentTutoringTutor(responseStudentTutoringTutor.data);
        } else {
          toast.error(
            'Falha ao obter da monitoria. Tente novamente mais tarde.'
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

  useEffect(() => {
    fetchStudentTutoringTutorData();
  }, [fetchStudentTutoringTutorData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Novo horário" />

      <FormPaper>
        <form onSubmit={createForm.handleSubmit}>
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                defaultValue="Monitoria"
                label="Monitoria"
                value={studentTutoringTutor?.student_tutoring?.course_name}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Local de encontro *"
                placeholder="Biblioteca, Google Meet, etc."
                name="meeting_place"
                formAttributes={createForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="day_of_the_week"
                label="Dia da semana *"
                value={createForm.values.day_of_the_week}
                fullWidth
              >
                {daysOfTheWeekOptions.map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.name}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>

            <Grid item xs={12}>
              <hr />
              <Typography variant="body2">Campos opcionais:</Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormInput
                label="Horário de início"
                placeholder="HH:MM"
                name="starts_at"
                formAttributes={createForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormInput
                label="Horário de término"
                placeholder="HH:MM"
                name="ends_at"
                formAttributes={createForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Link da aula"
                placeholder="Ex.: https://meet.google.com/abc-defg-hij"
                name="meeting_url"
                formAttributes={createForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Observação sobre a monitoria"
                placeholder={`Exemplos:
resolução da 1ª lista de exercícios;
irei tirar dúvidas sobre a P1.`}
                name="note"
                formAttributes={createForm}
                autoComplete="off"
                rows={3}
                multiline
                fullWidth
              />
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loadingClassSchedule} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default ClassScheduleCreate;
