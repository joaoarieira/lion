import { IconButton, styled } from '@mui/material';
import { grey } from '@mui/material/colors';

export const StyledIconButton = styled(IconButton, {
  name: 'StyledIconButton',
})`
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 3px;
  border-radius: 3px;

  &:hover {
    background-color: ${grey[200]};
  }
`;
