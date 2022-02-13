import { Box, Typography } from '@mui/material';
import { TitleWrapper } from './styles';

interface ICrudHeaderProps {
  title: string;
}

export function CrudHeader({ title }: ICrudHeaderProps): JSX.Element {
  return (
    <Box marginBottom="1.5rem">
      <TitleWrapper>
        <Typography component="h1" variant="h5" fontWeight={300}>
          {title}
        </Typography>
      </TitleWrapper>
    </Box>
  );
}

export default CrudHeader;
