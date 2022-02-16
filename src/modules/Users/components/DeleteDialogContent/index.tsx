import { DialogContent, DialogContentText } from '@mui/material';

export function DeleteDialogContent(): JSX.Element {
  return (
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        Este monitor será <b>desvinculado</b> de TODAS as suas monitorias.
        <br /> Tenha certeza do que está fazendo. Esta ação é{' '}
        <b>irreversível</b>.
      </DialogContentText>
    </DialogContent>
  );
}
