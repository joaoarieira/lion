import { Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { CrudHeader } from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';

interface ICampusCreateValues {
  name: string;
}

export function CampusCreate(): JSX.Element {
  document.title = 'Campus | Lion';

  const { post, response, loading } = useFetch('/campuses');
  const { authenticated, userAuthenticated } = useAuth();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 50 caracteres'),
  });

  const createForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await createCampus(values);
    },
  });

  const createCampus = useCallback(
    async (values: ICampusCreateValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          await post(values);

          if (response.ok) {
            createForm.resetForm();
            toast.success('Campus criado com sucesso.');
          } else {
            toast.error('Falha ao criar novo. Tente novamente mais tarde.');
          }
        }
      }
    },
    [authenticated, createForm, post, response.ok, userAuthenticated.role]
  );

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Novo campus" />

      <FormPaper>
        <form onSubmit={createForm.handleSubmit}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={createForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>
          </Grid>

          <FormFooter>
            <SaveButton type="submit" disabled={loading} />
          </FormFooter>
        </form>
      </FormPaper>
    </Box>
  );
}

export default CampusCreate;
