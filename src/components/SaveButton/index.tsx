import { Button, ButtonProps } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';

export function SaveButton(props: ButtonProps): JSX.Element {
  return (
    <Button
      type="submit"
      variant="contained"
      startIcon={<SaveOutlined />}
      {...props}
    >
      Salvar
    </Button>
  );
}

export default SaveButton;
