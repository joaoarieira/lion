import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

import { IUser } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { formatDateTime, roleNames, translateRole } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';
import { Status } from '../../../../components/Status';
import { DeleteDialogContent } from '../../components/DeleteDialogContent';

export function UsersList(): JSX.Element {
  document.title = 'Cursos | Lion';

  const [users, setUsers] = useState<IUser[]>([]);
  const [userId, setUserId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { get, del, response } = useFetch('/users');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchUsersData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await get();

        if (response.ok) {
          setUsers(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos usuários. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, response, userAuthenticated.role]);

  const isUserStudentTutor = useCallback(
    (id: string | undefined): boolean => {
      if (id) {
        return users.some(
          (user) =>
            user.id === id && user.role?.name === roleNames.student_tutor
        );
      }

      return false;
    },
    [users]
  );

  const canDelete = useCallback((user: IUser) => {
    // não é possível excluir: um admin e
    // um professor relacionado a uma monitoria
    if (user.role?.name === roleNames.student_tutor) {
      return true;
    }

    if (user.role?.name === roleNames.professor) {
      if (user.student_tutorings) {
        if (user.student_tutorings.length > 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }

    return false;
  }, []);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setUserId(id);
  }, []);

  const handleDeleteUser = useCallback(async () => {
    await del(userId);

    if (response.ok) {
      toast.success('Usuário excluído com sucesso.');
      fetchUsersData();
    } else {
      toast.error('Falha ao excluir registro. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [userId, del, fetchUsersData, response.ok]);

  const handleCreateUser = useCallback(() => navigate('new'), [navigate]);

  const handleEditUser = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  return (
    <Box>
      <CrudHeader
        title="Usuários"
        showButton
        onClickButton={handleCreateUser}
      />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Nível</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Criação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell component="th">{user.name}</TableCell>
                <TableCell component="th">{user.email}</TableCell>
                <TableCell component="th">
                  {translateRole(user.role?.name)}
                </TableCell>
                <TableCell component="th">
                  <Status isActive={user.is_active} />
                </TableCell>
                <TableCell component="th">
                  {formatDateTime(user.created_at)}
                </TableCell>
                <ActionsCell
                  hideToggle
                  onClickEdit={() => handleEditUser(user.id)}
                  disableDelete={!canDelete(user)}
                  onClickDelete={() => handleOpenModal(user.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteUser}
        customContent={
          isUserStudentTutor(userId) ? <DeleteDialogContent /> : undefined
        }
      />
    </Box>
  );
}

export default UsersList;
