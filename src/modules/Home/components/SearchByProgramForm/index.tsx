import { Box, Button, Grid, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SearchOutlined } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { FormSelect } from '../../../../components/FormSelect';
import useFetch from 'use-http';
import { toast } from 'react-toastify';
import { IProgram } from '../../../../@types/entities';

export function SearchByProgramForm(): JSX.Element {
  const [programs, setPrograms] = useState<IProgram[]>([]);

  const navigate = useNavigate();

  const { get, response, loading } = useFetch('/programs');

  const validationSchema = Yup.object().shape({
    program_id: Yup.string().required('Escolha um curso'),
  });

  const searchProgramForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      program_id: '',
    },
    validationSchema,
    onSubmit: async ({ program_id }) => {
      navigate(`/search?program_id=${program_id}`);
    },
  });

  const fetchProgramsData = useCallback(async () => {
    await get();

    if (response.ok) {
      setPrograms(response.data);
    } else {
      toast.error(
        'Falha ao obter os dados dos cursos. Tente novamente mais tarde.'
      );
    }
  }, [get, response]);

  const handleChangeSearch = useCallback(() => {
    searchProgramForm.resetForm();
    navigate('/');
  }, [navigate, searchProgramForm]);

  useEffect(() => {
    fetchProgramsData();
  }, [fetchProgramsData]);

  return (
    <Box flexGrow={1}>
      <form
        style={{ display: 'flex', justifyContent: 'center' }}
        onSubmit={searchProgramForm.handleSubmit}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          alignContent="center"
          rowSpacing={5}
          style={{ minHeight: 'calc(100vh - 130px)', maxWidth: '400px' }}
        >
          <Grid item xs={12}>
            <FormSelect
              formAttributes={searchProgramForm}
              name="program_id"
              label="Curso"
              value={searchProgramForm.values.program_id}
              disabled={loading}
              fullWidth
            >
              {programs.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.name}
                </MenuItem>
              ))}
            </FormSelect>
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              endIcon={<SearchOutlined />}
              fullWidth
            >
              Pesquisar
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button type="button" onClick={handleChangeSearch}>
                Buscar por monitorias
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default SearchByProgramForm;
