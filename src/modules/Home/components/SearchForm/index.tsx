import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SearchOutlined } from '@mui/icons-material';

import { FormInput } from '../../../../components/FormInput';

export function SearchForm(): JSX.Element {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    query: Yup.string(),
  });

  const searchForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      query: '',
    },
    validationSchema,
    onSubmit: async ({ query }) => {
      navigate(`/search?query=${query}`);
    },
  });

  const handleChangeSearch = useCallback(() => {
    searchForm.resetForm();
    navigate('/search-by-program');
  }, [navigate, searchForm]);

  return (
    <Box flexGrow={1}>
      <form
        style={{ display: 'flex', justifyContent: 'center' }}
        onSubmit={searchForm.handleSubmit}
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
            <FormInput
              label="Pesquisar monitorias"
              placeholder="Cálculo, Sociologia, CRP192, etc."
              name="query"
              formAttributes={searchForm}
              autoComplete="off"
              fullWidth
            />
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
                Buscar por cursos
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default SearchForm;
