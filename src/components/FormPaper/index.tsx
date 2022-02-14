import { PaperProps } from '@mui/material';
import { StyledPaper } from './styles';

export function FormPaper(props: PaperProps): JSX.Element {
  return <StyledPaper {...props} />;
}

export default FormPaper;
