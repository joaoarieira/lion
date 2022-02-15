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

import { ICampus } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';

export function CampusesList(): JSX.Element {
  document.title = 'Campi | Lion';

  const [campuses, setCampuses] = useState<ICampus[]>([]);
  const [campusId, setCampusId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { get, del, response } = useFetch('/campuses');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchCampusesData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await get();

        if (response.ok) {
          setCampuses(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos campi. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, response, userAuthenticated.role]);

  const canDelete = useCallback((campus: ICampus) => {
    // exclui um campus apenas se não há nenhum curso relacionado a ele
    if (campus.programs) {
      if (campus.programs.length === 0) {
        return true;
      }
    }
    return false;
  }, []);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setCampusId(id);
  }, []);

  const handleDeleteCampus = useCallback(async () => {
    await del(campusId);

    if (response.ok) {
      toast.success('Campus excluído com sucesso.');
      fetchCampusesData();
    } else {
      toast.error('Falha ao excluir registro. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [campusId, del, fetchCampusesData, response.ok]);

  const handleCreateCampus = useCallback(() => navigate('new'), [navigate]);

  const handleEditCampus = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchCampusesData();
  }, [fetchCampusesData]);

  // TODO: criar um componente para as tabelas

  return (
    <Box>
      <CrudHeader title="Campi" showButton onClickButton={handleCreateCampus} />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell component="th">{campus.name}</TableCell>
                <ActionsCell
                  hideToggle
                  onClickEdit={() => handleEditCampus(campus.id)}
                  disableDelete={!canDelete(campus)}
                  onClickDelete={() => handleOpenModal(campus.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteCampus}
      />
    </Box>
  );
}

export default CampusesList;
