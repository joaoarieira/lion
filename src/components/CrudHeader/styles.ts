import { Box, styled } from '@mui/material';
import { grey } from '@mui/material/colors';

export const StyledBox = styled(Box, { name: 'StyledBox' })`
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

export const TitleWrapper = styled('div', { name: 'TitleWrapper' })`
  border-bottom: 1px solid ${grey[700]};
  min-width: 10rem;
`;
