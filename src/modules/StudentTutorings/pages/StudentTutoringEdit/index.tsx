import { Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { IProgram, IStudentTutoring } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import FormMultiSelect from '../../../../components/FormMultiSelect';
import { useParams } from 'react-router-dom';

interface IStudentTutoringEditValues {
  course_code?: string;
  course_name: string;
  programs: IProgramOption[];
}

interface IProgramOption {
  id: string;
  name: string;
}

interface IPutValues extends Omit<IStudentTutoringEditValues, 'programs'> {
  programs_ids: string[];
}

export function StudentTutoringEdit(): JSX.Element {
  document.title = 'Monitoria | Lion';

  const { id } = useParams();

  const [programs, setPrograms] = useState<IProgramOption[]>([]);
  const [studentTutoring, setStudentTutoring] = useState<
    IStudentTutoring | undefined
  >();

  const { authenticated, userAuthenticated } = useAuth();
  const {
    get: getPrograms,
    response: responsePrograms,
    loading: loadingPrograms,
  } = useFetch('/programs');
  const {
    get: getStudentTutoring,
    put: putStudentTutoring,
    response: responseStudentTutoring,
    loading: loadingStudentTutoring,
  } = useFetch('/student-tutorings');

  const validationSchema = Yup.object().shape({
    course_code: Yup.string()
      .required('Código é obrigatório')
      .min(6, 'Deve ter 6 caracteres')
      .max(6, 'Deve ter 6 caracteres'),
    course_name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 40 caracteres'),
    programs: Yup.array()
      .required('Curso é obrigatório')
      .min(1, 'Curso é obrigatório'),
  });

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      course_code: studentTutoring?.course_code ?? '',
      course_name: studentTutoring?.course_name ?? '',
      programs:
        studentTutoring?.student_tutoring_programs?.map((item) => ({
          id: item.program?.id ?? '',
          name: item.program?.name ?? '',
        })) ?? [],
    },
    validationSchema,
    onSubmit: async (values) => {
      await editStudentTutoring(values);
    },
  });

  const fetchProgramsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getPrograms();

        if (responsePrograms.ok) {
          const programsData = responsePrograms.data as IProgram[];
          const programsOptions = programsData.map((program) => ({
            id: program.id,
            name: program.name,
          }));
          setPrograms(programsOptions);
        } else {
          toast.error(
            'Falha ao obter os dados dos cursos. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, getPrograms, responsePrograms, userAuthenticated.role]);

  const fetchStudentTutoringData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getStudentTutoring(id);

        if (responseStudentTutoring.ok) {
          setStudentTutoring(responseStudentTutoring.data);
        } else {
          toast.error(
            'Falha ao obter os dados da monitoria. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [
    authenticated,
    getStudentTutoring,
    id,
    responseStudentTutoring,
    userAuthenticated.role,
  ]);

  const preparePutValues = useCallback(
    (values: IStudentTutoringEditValues): IPutValues => {
      const { programs, course_code, ...rest } = values;
      const preparedValues = { ...rest } as IPutValues;

      if (course_code !== editForm.values.course_code) {
        preparedValues.course_code = course_code;
      }

      const programs_ids = programs.map((program) => program.id);
      if (programs_ids.length > 0) {
        preparedValues.programs_ids = programs_ids;
      }
      return preparedValues;
    },
    [editForm.values.course_code]
  );

  const editStudentTutoring = useCallback(
    async (values: IStudentTutoringEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await putStudentTutoring(id, preparePutValues(values));

          if (responseStudentTutoring.ok) {
            const responseData =
              responseStudentTutoring.data as IStudentTutoring;
            const newStudentTutoring = {
              programs_ids: responseData.student_tutoring_programs?.map(
                (item) => ({ id: item.program?.id, name: item.program?.name })
              ),
              ...responseData,
            };
            setStudentTutoring(newStudentTutoring);
            toast.success('Monitoria editada com sucesso.');
          } else {
            editForm.resetForm();
            toast.error(
              'Falha ao editar esta monitoria. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      userAuthenticated.role,
      putStudentTutoring,
      id,
      preparePutValues,
      responseStudentTutoring,
      editForm,
    ]
  );

  useEffect(() => {
    fetchStudentTutoringData();
    fetchProgramsData();
  }, [fetchProgramsData, fetchStudentTutoringData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Editar monitoria" />

      <FormPaper>
        <form onSubmit={editForm.handleSubmit}>
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={12} md={3}>
              <FormInput
                label="Código"
                placeholder="Digite o código"
                name="course_code"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="course_name"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormMultiSelect
                formAttributes={editForm}
                name="programs"
                label="Cursos"
                options={programs}
                disabled={loadingPrograms}
              />
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loadingStudentTutoring} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default StudentTutoringEdit;
