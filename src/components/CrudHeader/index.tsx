import { AddOutlined } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { TitleWrapper, StyledBox } from './styles';

interface ICrudHeaderProps {
  title: string;
  showButton?: boolean;
  onClickButton?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  customButton?: React.ReactNode;
}

export function CrudHeader({
  title,
  showButton,
  onClickButton,
  customButton,
}: ICrudHeaderProps): JSX.Element {
  return (
    <StyledBox>
      <TitleWrapper>
        <Typography component="h1" variant="h5" fontWeight={300}>
          {title}
        </Typography>
      </TitleWrapper>

      {showButton ? (
        !customButton ? (
          <Button
            variant="outlined"
            onClick={onClickButton}
            startIcon={<AddOutlined />}
          >
            Novo
          </Button>
        ) : (
          customButton
        )
      ) : null}
    </StyledBox>
  );
}

export default CrudHeader;
