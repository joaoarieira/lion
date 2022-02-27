import { Box, Typography, Link } from '@mui/material';
import CrudHeader from '../../components/CrudHeader';

export function Notices(): JSX.Element {
  return (
    <Box>
      <CrudHeader title="Editais" />

      <Typography variant="body1" marginBottom="0.75rem">
        Tenha acesso aos editais das monitorias na página oficial da{' '}
        <b>Diretoria de Ensino</b>:
      </Typography>

      <Link href="https://dre.crp.ufv.br/?page_id=161" target="_blank">
        https://dre.crp.ufv.br/?page_id=161
      </Link>
    </Box>
  );
}

export default Notices;
