import {
  DeleteOutlined,
  EditOutlined,
  PowerSettingsNewOutlined,
} from '@mui/icons-material';
import { IconButtonProps, TableCell, Tooltip } from '@mui/material';
import TableButton from '../TableButton';
import { ContainerButtons } from './styles';

interface IActionsCellProps {
  disableToggle?: boolean;
  disableEdit?: boolean;
  disableDelete?: boolean;
  hideToggle?: boolean;
  hideEdit?: boolean;
  hideDelete?: boolean;
  onClickToggle?: React.MouseEventHandler<HTMLButtonElement>;
  onClickEdit?: React.MouseEventHandler<HTMLButtonElement>;
  onClickDelete?: React.MouseEventHandler<HTMLButtonElement>;
  toggleButtonProps?: IconButtonProps;
  editButtonProps?: IconButtonProps;
  deleteButtonProps?: IconButtonProps;
}

export function ActionsCell({
  disableToggle = false,
  disableEdit = false,
  disableDelete = false,
  hideToggle = false,
  hideEdit = false,
  hideDelete = false,
  onClickToggle,
  onClickEdit,
  onClickDelete,
  toggleButtonProps,
  editButtonProps,
  deleteButtonProps,
}: IActionsCellProps): JSX.Element {
  return (
    <TableCell align="right">
      <ContainerButtons>
        {!hideToggle && (
          <Tooltip title="Ativar/desativar">
            <span>
              <TableButton
                onClick={onClickToggle}
                disabled={disableToggle}
                {...toggleButtonProps}
              >
                <PowerSettingsNewOutlined fontSize="small" />
              </TableButton>
            </span>
          </Tooltip>
        )}

        {!hideEdit && (
          <Tooltip title="Editar">
            <span>
              <TableButton
                onClick={onClickEdit}
                disabled={disableEdit}
                {...editButtonProps}
              >
                <EditOutlined fontSize="small" />
              </TableButton>
            </span>
          </Tooltip>
        )}

        {!hideDelete && (
          <Tooltip title="Excluir">
            <span>
              <TableButton
                onClick={onClickDelete}
                disabled={disableDelete}
                {...deleteButtonProps}
              >
                <DeleteOutlined fontSize="small" />
              </TableButton>
            </span>
          </Tooltip>
        )}
      </ContainerButtons>
    </TableCell>
  );
}

export default ActionsCell;
