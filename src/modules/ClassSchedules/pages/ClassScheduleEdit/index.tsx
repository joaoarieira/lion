import { Box, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { CrudHeader } from '../../../../components/CrudHeader';
import {
  daysOfTheWeekOptions,
  removeSeconds,
  roleNames,
} from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { useParams } from 'react-router-dom';
import { IClassSchedule } from '../../../../@types/entities';
import { FormSelect } from '../../../../components/FormSelect';

interface ClassScheduleEditValues {
  student_tutoring_tutor_id: string;
  day_of_the_week: number;
  meeting_place: string;
  meeting_url?: string;
  note?: string;
  starts_at?: string;
  ends_at?: string;
}

export function ClassScheduleEdit(): JSX.Element {
  document.title = 'Horário | Lion';

  const [classSchedule, setClassSchedule] = useState<
    IClassSchedule | undefined
  >();

  const { id2: id } = useParams();
  const { authenticated, userAuthenticated } = useAuth();

  const {
    get: getClassSchedule,
    put: putClassSchedule,
    response: responseClassSchedule,
    loading: loadingClassSchedule,
  } = useFetch('/class-schedules');

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

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      student_tutoring_tutor_id: id ?? '-',
      day_of_the_week: classSchedule?.day_of_the_week ?? 1,
      meeting_place: classSchedule?.meeting_place ?? '',
      meeting_url: classSchedule?.meeting_url ?? '',
      note: classSchedule?.note ?? '',
      starts_at: removeSeconds(classSchedule?.starts_at) ?? '',
      ends_at: removeSeconds(classSchedule?.ends_at) ?? '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await editClassSchedule(values);
    },
  });

  const editClassSchedule = useCallback(
    async (values: ClassScheduleEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.student_tutor) {
          const preparedData = values;

          if (preparedData.ends_at === editForm.initialValues.ends_at)
            delete preparedData.ends_at;
          if (preparedData.starts_at === editForm.initialValues.starts_at)
            delete preparedData.starts_at;
          if (preparedData.meeting_url === editForm.initialValues.meeting_url)
            delete preparedData.meeting_url;
          if (preparedData.note === editForm.initialValues.note)
            delete preparedData.note;

          await putClassSchedule(id, preparedData);

          if (responseClassSchedule.ok) {
            setClassSchedule(responseClassSchedule.data);
            toast.success('Horário editado com sucesso.');
          } else {
            editForm.resetForm();
            toast.error('Falha ao editar horário. Tente novamente mais tarde.');
          }
        }
      }
    },
    [
      authenticated,
      editForm,
      id,
      putClassSchedule,
      responseClassSchedule,
      userAuthenticated.role,
    ]
  );

  const fetchClassScheduleData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.student_tutor) {
        await getClassSchedule(id);

        if (responseClassSchedule.ok) {
          setClassSchedule(responseClassSchedule.data);
        } else {
          toast.error(
            'Falha ao obter este horário. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [
    authenticated,
    getClassSchedule,
    id,
    responseClassSchedule,
    userAuthenticated.role,
  ]);

  useEffect(() => {
    fetchClassScheduleData();
  }, [fetchClassScheduleData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Editar horário" />

      <FormPaper>
        <form onSubmit={editForm.handleSubmit}>
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                disabled
                label="Monitoria"
                value={
                  classSchedule?.student_tutoring_tutor?.student_tutoring
                    ?.course_name ?? ''
                }
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Local de encontro *"
                placeholder="Biblioteca, Google Meet, etc."
                name="meeting_place"
                formAttributes={editForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={editForm}
                name="day_of_the_week"
                label="Dia da semana *"
                value={editForm.values.day_of_the_week}
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
                formAttributes={editForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormInput
                label="Horário de término"
                placeholder="HH:MM"
                name="ends_at"
                formAttributes={editForm}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormInput
                label="Link da aula"
                placeholder="Ex.: https://meet.google.com/abc-defg-hij"
                name="meeting_url"
                formAttributes={editForm}
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
                formAttributes={editForm}
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

export default ClassScheduleEdit;
