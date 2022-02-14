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

import { IProgram } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';

export function Programs(): JSX.Element {
  document.title = 'Cursos | Lion';

  const [programs, setPrograms] = useState<IProgram[]>([]);
  const [programId, setProgramId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { get, del, response } = useFetch('/programs');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchProgramsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await get();

        if (response.ok) {
          setPrograms(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos cursos. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, response, userAuthenticated.role]);

  const canDelete = useCallback((program: IProgram) => {
    // exclui um curso apenas se não há nenhuma monitoria relacionado a ele
    if (program.student_tutoring_programs) {
      if (program.student_tutoring_programs.length === 0) {
        return true;
      }
    }
    return false;
  }, []);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setProgramId(id);
  }, []);

  const handleDeleteProgram = useCallback(async () => {
    await del(programId);

    if (response.ok) {
      toast.success('Programa excluído com sucesso.');
      fetchProgramsData();
    } else {
      toast.error('Falha ao excluir registro. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [programId, del, fetchProgramsData, response.ok]);

  const handleCreateProgram = useCallback(() => navigate('new'), [navigate]);

  const handleEditProgram = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchProgramsData();
  }, [fetchProgramsData]);

  return (
    <Box>
      <CrudHeader
        title="Cursos"
        showButton
        onClickButton={handleCreateProgram}
      />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Campus</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.id}>
                <TableCell component="th">{program.name}</TableCell>
                <TableCell component="th">{program.campus?.name}</TableCell>
                <ActionsCell
                  hideToggle
                  onClickEdit={() => handleEditProgram(program.id)}
                  disableDelete={!canDelete(program)}
                  onClickDelete={() => handleOpenModal(program.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteProgram}
      />
    </Box>
  );
}

export default Programs;
