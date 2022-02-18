import { Box, Grid } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { ICampus } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { isUUID, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';

interface ICampusEditValues {
  name: string;
}

export function CampusEdit(): JSX.Element {
  document.title = 'Campus | Lion';

  const [campus, setCampus] = useState<ICampus | undefined>();

  const { id } = useParams();
  const { get, put, response, loading } = useFetch('/campuses');
  const { authenticated, userAuthenticated } = useAuth();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .max(40, 'Máximo 50 caracteres'),
  });

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: campus?.name ?? '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await editCampus(values);
    },
  });

  const fetchCampusData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        if (isUUID(id)) {
          await get(id);

          if (response.ok) {
            setCampus(response.data);
          } else {
            toast.error(
              'Falha ao obter os dados do campus. Tente novamente mais tarde.'
            );
          }
        }
      }
    }
  }, [authenticated, get, id, response, userAuthenticated.role]);

  const editCampus = useCallback(
    async (values: ICampusEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          if (isUUID(id)) {
            await put(id, values);

            if (response.ok) {
              setCampus(response.data);
              toast.success('Campus editado com sucesso.');
            } else {
              editForm.resetForm();
              toast.error(
                'Falha ao editar este campus. Tente novamente mais tarde.'
              );
            }
          }
        }
      }
    },
    [authenticated, id, put, response, editForm, userAuthenticated.role]
  );

  useEffect(() => {
    fetchCampusData();
  }, [fetchCampusData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Editar campus" />

      <FormPaper>
        <form onSubmit={editForm.handleSubmit}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={editForm}
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

export default CampusEdit;
