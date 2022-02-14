import { IconButtonProps } from '@mui/material';
import { StyledIconButton } from './styles';

export function TableButton({ ...props }: IconButtonProps): JSX.Element {
  return <StyledIconButton {...props} />;
}

export default TableButton;
