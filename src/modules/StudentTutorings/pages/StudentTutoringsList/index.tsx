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

import { IStudentTutoring } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';
import { StringLimiter } from '../../../../components/StringLimiter';

export function StudentTutoringsList(): JSX.Element {
  document.title = 'Monitorias | Lion';

  const [studentTutorings, setStudentTutorings] = useState<IStudentTutoring[]>(
    []
  );
  const [studentTutoringId, setStudentTutoringId] = useState<
    string | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { get, del, response } = useFetch('/student-tutorings');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchStudentTutoringsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await get();

        if (response.ok) {
          setStudentTutorings(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados das monitorias. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, response, userAuthenticated.role]);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setStudentTutoringId(id);
  }, []);

  const handleDeleteStudentTutoring = useCallback(async () => {
    await del(studentTutoringId);

    if (response.ok) {
      toast.success('Monitoria excluída com sucesso.');
      fetchStudentTutoringsData();
    } else {
      toast.error('Falha ao excluir monitoria. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [studentTutoringId, del, fetchStudentTutoringsData, response.ok]);

  const handleCreateStudentTutoring = useCallback(
    () => navigate('new'),
    [navigate]
  );

  const handleEditStudentTutoring = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchStudentTutoringsData();
  }, [fetchStudentTutoringsData]);

  return (
    <Box>
      <CrudHeader
        title="Monitorias"
        showButton
        onClickButton={handleCreateStudentTutoring}
      />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Cursos</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {studentTutorings.map((studentTutoring) => (
              <TableRow key={studentTutoring.id}>
                <TableCell component="th">
                  {studentTutoring.course_code}
                </TableCell>
                <TableCell component="th">
                  {studentTutoring.course_name}
                </TableCell>
                <TableCell component="th">
                  {
                    <StringLimiter
                      limit={35}
                      value={
                        studentTutoring.student_tutoring_programs
                          ?.map((item) => item.program?.name ?? '')
                          .join(', ') ?? ''
                      }
                    />
                  }
                </TableCell>
                <ActionsCell
                  hideToggle
                  onClickEdit={() =>
                    handleEditStudentTutoring(studentTutoring.id)
                  }
                  onClickDelete={() => handleOpenModal(studentTutoring.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteStudentTutoring}
      />
    </Box>
  );
}

export default StudentTutoringsList;
