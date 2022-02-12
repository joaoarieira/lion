import { Paper, styled, Grid, Box } from '@mui/material';

export const CourseNamePaper = styled(Paper, { name: 'CourseNamePaper' })`
  display: flex;
  justify-content: center;
`;

export const InfoContainer = styled(Grid, { name: 'InfoContainer' })`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const SchedulesBox = styled(Box, { name: 'SchedulesBox' })`
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  padding: 0.5rem;
`;
