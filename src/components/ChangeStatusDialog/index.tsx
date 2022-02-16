import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogProps,
} from '@mui/material';

interface IChangeStatusDialogProps extends DialogProps {
  isActive: boolean;
  handleClose: React.MouseEventHandler<HTMLButtonElement>;
  handleConfirm: React.MouseEventHandler<HTMLButtonElement>;
  content?: React.ReactNode;
}

export function ChangeStatusDialog({
  isActive,
  handleClose,
  handleConfirm,
  content,
  ...dialogProps
}: IChangeStatusDialogProps): JSX.Element {
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...dialogProps}
    >
      <DialogTitle id="alert-dialog-title">
        Deseja {isActive ? 'desativar' : 'ativar'} este registro?
      </DialogTitle>

      {content && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button
          variant="outlined"
          color={isActive ? 'error' : 'primary'}
          onClick={handleConfirm}
          autoFocus
        >
          {isActive ? 'Desativar' : 'Ativar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
