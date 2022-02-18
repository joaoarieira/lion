import { Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { IProgram } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import FormMultiSelect from '../../../../components/FormMultiSelect';

interface IStudentTutoringCreateValues {
  course_code: string;
  course_name: string;
  programs: IProgramOption[];
}

interface IProgramOption {
  id: string;
  name: string;
}

interface IPostValues extends Omit<IStudentTutoringCreateValues, 'programs'> {
  programs_ids: string[];
}

export function StudentTutoringCreate(): JSX.Element {
  document.title = 'Monitoria | Lion';

  const [programs, setPrograms] = useState<IProgramOption[]>([]);

  const { authenticated, userAuthenticated } = useAuth();
  const {
    get: getPrograms,
    response: responsePrograms,
    loading: loadingPrograms,
  } = useFetch('/programs');
  const {
    post: postStudentTutoring,
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
      .max(40, 'Máximo 50 caracteres'),
    programs: Yup.array()
      .required('Curso é obrigatório')
      .min(1, 'Curso é obrigatório'),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnChange: false,
    initialValues: {
      course_code: '',
      course_name: '',
      programs: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      await createStudentTutoring(values);
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

  const preparePostValues = useCallback(
    (values: IStudentTutoringCreateValues): IPostValues => {
      const { programs, ...rest } = values;
      const programs_ids = programs.map((program) => program.id);
      return { programs_ids, ...rest };
    },
    []
  );

  const createStudentTutoring = useCallback(
    async (values: IStudentTutoringCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await postStudentTutoring(preparePostValues(values));

          if (responseStudentTutoring.ok) {
            createForm.resetForm();
            toast.success('Monitoria criada com sucesso.');
          } else {
            toast.error(
              'Falha ao criar esta monitoria. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      createForm,
      postStudentTutoring,
      preparePostValues,
      responseStudentTutoring.ok,
      userAuthenticated.role,
    ]
  );

  useEffect(() => {
    fetchProgramsData();
  }, [fetchProgramsData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Nova monitoria" />

      <FormPaper>
        <form onSubmit={createForm.handleSubmit}>
          <Grid container columnSpacing={2} rowSpacing={4}>
            <Grid item xs={12} md={3}>
              <FormInput
                label="Código"
                placeholder="Digite o código"
                name="course_code"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="course_name"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormMultiSelect
                formAttributes={createForm}
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

export default StudentTutoringCreate;
