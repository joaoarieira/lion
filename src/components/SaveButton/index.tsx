import { Button, ButtonProps } from '@mui/material';
import { SaveOutlined } from '@mui/icons-material';

export function SaveButton(props: ButtonProps): JSX.Element {
  return (
    <Button type="submit" variant="contained" {...props}>
      <SaveOutlined fontSize="small" />
      <span style={{ marginLeft: '0.5rem' }}>Salvar</span>
    </Button>
  );
}

export default SaveButton;
