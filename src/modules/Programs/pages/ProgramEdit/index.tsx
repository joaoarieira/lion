import { Box, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import * as Yup from 'yup';

import { ICampus, IProgram } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { isUUID, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { FormInput } from '../../../../components/FormInput';
import { FormPaper } from '../../../../components/FormPaper';
import { FormFooter } from '../../../../components/FormFooter';
import { SaveButton } from '../../../../components/SaveButton';
import { FormSelect } from '../../../../components/FormSelect';

interface IProgramEditValues {
  name: string;
  campus_id: string;
}

export function Program(): JSX.Element {
  document.title = 'Curso | Lion';

  const [program, setProgram] = useState<IProgram | undefined>();
  const [campuses, setCampuses] = useState<ICampus[]>([]);

  const { id } = useParams();
  const { authenticated, userAuthenticated } = useAuth();
  const {
    get: getProgram,
    put: putProgram,
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

  const editForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: program?.name ?? '',
      campus_id: program?.campus_id ?? '',
    },
    validationSchema,
    onSubmit: async (values) => {
      await editProgram(values);
    },
  });

  const fetchProgramData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        if (isUUID(id)) {
          await getProgram(id);

          if (responseProgram.ok) {
            setProgram(responseProgram.data);
          } else {
            toast.error(
              'Falha ao obter os dados do curso. Tente novamente mais tarde.'
            );
          }
        }
      }
    }
  }, [authenticated, getProgram, id, responseProgram, userAuthenticated.role]);

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

  const editProgram = useCallback(
    async (values: IProgramEditValues) => {
      if (authenticated) {
        if (userAuthenticated.role === roleNames.admin) {
          if (isUUID(id)) {
            await putProgram(id, values);

            if (responseProgram.ok) {
              setProgram(responseProgram.data);
              toast.success('Curso editado com sucesso.');
            } else {
              toast.error(
                'Falha ao editar este curso. Tente novamente mais tarde.'
              );
            }
          }
        }
      }
    },
    [authenticated, id, putProgram, responseProgram, userAuthenticated.role]
  );

  useEffect(() => {
    fetchCampusesData();
    fetchProgramData();
  }, [fetchCampusesData, fetchProgramData]);

  return (
    <Box flexGrow={1}>
      <CrudHeader title="Editar curso" />

      <FormPaper>
        <form onSubmit={editForm.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <FormInput
                label="Nome"
                placeholder="Digite o nome"
                name="name"
                formAttributes={editForm}
                autoComplete="off"
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormSelect
                formAttributes={editForm}
                label="Campus"
                name="campus_id"
                value={editForm.values.campus_id}
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
