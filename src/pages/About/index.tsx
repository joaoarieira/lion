import { Box, Grid, Link, Typography } from '@mui/material';
import CrudHeader from '../../components/CrudHeader';

export function About(): JSX.Element {
  return (
    <Box>
      <CrudHeader title="Sobre o Lion" />

      <Grid container maxWidth="800px" rowSpacing={3}>
        <Grid item xs={12}>
          <Typography variant="body1">
            O objetivo do projeto Lion é organizar os horários das aulas das
            monitorias oferecidas nas universidades, focando inicialmente na UFV
            - <i>Campus</i> Rio Paranaíba.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Autor: João Vitor Azevedo
            <br />
            <Link href="mailto:joao.azevedo@ufv.br">joao.azevedo@ufv.br</Link>
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Repositórios:
            <br />
            front-end:{' '}
            <Link href="https://github.com/joaoarieira/lion" target="_blank">
              https://github.com/joaoarieira/lion
            </Link>
            <br />
            back-end:{' '}
            <Link
              href="https://github.com/joaoarieira/lion-api"
              target="_blank"
            >
              https://github.com/joaoarieira/lion-api
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default About;
