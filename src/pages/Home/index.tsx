import { Box, Button, Container, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useFetch from 'use-http';
import { InputForm } from '../../components/InputForm';
import { SearchOutlined } from '@mui/icons-material';

export function Home(): JSX.Element {
  const { get, response } = useFetch('/users');

  async function handleClick(): Promise<void> {
    await get();
    console.log(response.data);
  }

  const validationSchema = Yup.object().shape({
    filter: Yup.string(),
  });

  const searchForm = useFormik({
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      filter: '',
    },
    validationSchema,
    onSubmit: async ({ filter }) => {
      console.log(filter);
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
          style={{ minHeight: 'calc(100vh - 110px)', maxWidth: '400px' }}
        >
          <Grid item xs={12}>
            <InputForm
              label="Pesquisar monitorias"
              placeholder="Cálculo, Sociologia, CRP192, etc."
              name="filter"
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
            {/* <button type="button" onClick={handleClick}>
              Get
            </button> */}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}

export default Home;
