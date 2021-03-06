import { green, red } from '@mui/material/colors';

interface IStatusProps {
  isActive: boolean;
}

export function Status({ isActive }: IStatusProps): JSX.Element {
  return (
    <div
      style={{
        padding: '2px',
        borderRadius: '3px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isActive ? green[500] : red[900],
        color: isActive ? green[500] : red[900],
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '60px',
        fontSize: '12px',
        fontWeight: '700',
      }}
    >
      {isActive ? 'ATIVO' : 'INATIVO'}
    </div>
  );
}
