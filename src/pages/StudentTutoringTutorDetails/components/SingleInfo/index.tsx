import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface ISingleInfoProps {
  icon?: ReactNode;
  label: ReactNode;
  value: ReactNode;
  isValueEmail?: boolean;
  isValueURL?: boolean;
  isValueLarge?: boolean;
}

export function SingleInfo({
  icon,
  label,
  value,
  isValueEmail = false,
  isValueURL = false,
  isValueLarge = false,
}: ISingleInfoProps): JSX.Element {
  return (
    <Box>
      <Typography
        variant="body1"
        component="label"
        fontWeight={300}
        sx={{
          display: 'flex',
          columnGap: '0.5rem',
          flexDirection: isValueLarge ? 'column' : 'row',
        }}
      >
        <span style={{ display: 'flex', flexWrap: 'nowrap', gap: '0.5rem' }}>
          {icon}
          {label}:
        </span>

        {!isValueEmail && !isValueURL && (
          <Typography fontWeight={300} marginLeft={isValueLarge ? '1rem' : '0'}>
            {value}
          </Typography>
        )}
        {isValueEmail && (
          <Typography
            component="a"
            href={`mailto: ${value}`}
            sx={{ textDecoration: 'none' }}
          >
            {value}
          </Typography>
        )}
        {isValueURL && (
          <Typography
            component="a"
            href={value?.toString()}
            sx={{ textDecoration: 'none' }}
            target="_blank"
          >
            entrar
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
