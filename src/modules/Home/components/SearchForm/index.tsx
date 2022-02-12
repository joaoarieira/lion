import { Box, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SearchOutlined } from '@mui/icons-material';

import { InputForm } from '../../../../components/InputForm';
import { useNavigate } from 'react-router-dom';

export function SearchForm(): JSX.Element {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    search: Yup.string(),
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
          spacing={5}
          style={{ minHeight: 'calc(100vh - 130px)', maxWidth: '400px' }}
        >
          <Grid item xs={12}>
            <InputForm
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
        </Grid>
      </form>
    </Box>
  );
}

export default SearchForm;
