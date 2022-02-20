import { Backdrop, CircularProgress, BackdropProps } from '@mui/material';

export function LoadingSuspense({
  ...backdropProps
}: BackdropProps): JSX.Element {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
      }}
      {...backdropProps}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
