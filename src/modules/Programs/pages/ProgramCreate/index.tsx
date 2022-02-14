import { Box, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { ICampus } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { FormSelect } from '../../../../components/FormSelect';

interface IProgramCreateValues {
  name: string;
  campus_id: string;
}

export function Program(): JSX.Element {
  document.title = 'Curso | Lion';

  const [campuses, setCampuses] = useState<ICampus[]>([]);

  const { authenticated, userAuthenticated } = useAuth();
  const {
    post: postProgram,
    response: responseProgram,
    loading: loadingProgram,
  } = useFetch('/programs');
  const {
    get: getCampuses,
    response: responseCampuses,
    loading: loadingCampuses,
  } = useFetch('/campuses');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 50 caracteres'),
    campus_id: Yup.string().required('Campus é obrigatório'),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: '',
      campus_id: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createProgram(values);
    },
  });

  const fetchCampusesData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await getCampuses();

        if (responseCampuses.ok) {
          setCampuses(responseCampuses.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos campi. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, getCampuses, responseCampuses, userAuthenticated.role]);

  const createProgram = useCallback(
    async (values: IProgramCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await postProgram(values);

          if (responseProgram.ok) {
            createForm.resetForm();
            toast.success('Curso criado com sucesso.');
          } else {
            toast.error(
              'Falha ao criar este curso. Tente novamente mais tarde.'
            );
          }
        }
      }
    },
    [
      authenticated,
      createForm,
      postProgram,
      responseProgram.ok,
      userAuthenticated.role,
    ]
  );

  useEffect(() => {
    fetchCampusesData();
  }, [fetchCampusesData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Novo curso" />

      <FormPaper>
        <form onSubmit={createForm.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={createForm}
                name="campus_id"
                label="Campus"
                value={createForm.values.campus_id}
                disabled={loadingCampuses}
                fullWidth
              >
                {campuses.map((campus) => (
                  <MenuItem key={campus.id} value={campus.id}>
                    {campus.name}
                  </MenuItem>
                ))}
              </FormSelect>
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loadingProgram} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default Program;
