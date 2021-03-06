import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from '@mui/material';

interface IDeleteDialogProps extends DialogProps {
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleConfirm: React.MouseEventHandler<HTMLButtonElement>;
  customContent?: React.ReactNode;
}

export function DeleteDialog({
  handleClose,
  handleConfirm,
  customContent,
  ...dialogProps
}: IDeleteDialogProps): JSX.Element {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...dialogProps}
    >
      <DialogTitle id="alert-dialog-title">
        Deseja realmente excluir este registro?
      </DialogTitle>

      {!customContent ? (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tenha certeza do que está fazendo. Esta ação é <b>irreversível</b>.
          </DialogContentText>
        </DialogContent>
      ) : (
        customContent
      )}

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleConfirm}
          autoFocus
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
