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

import { IStudentTutoringTutor } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { formatDateTime, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';

export function StudentTutoringTutorsList(): JSX.Element {
  document.title = 'Monitores | Lion';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentTutoringTutorId, setStudentTutoringTutorId] = useState<
    string | undefined
  >();
  const [studentTutoringTutors, setStudentTutoringTutors] = useState<
    IStudentTutoringTutor[]
  >([]);

  const { get, del, response } = useFetch('/student-tutoring-tutors');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchStudentTutoringTutorsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.admin) {
        await get();

        if (response.ok) {
          setStudentTutoringTutors(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados dos monitores e professores vinculados. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, response, userAuthenticated.role]);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setStudentTutoringTutorId(id);
  }, []);

  const handleDeleteStudentTutoringTutor = useCallback(async () => {
    await del(studentTutoringTutorId);

    if (response.ok) {
      toast.success(
        'Monitor e professor desvinculados à monitoria com sucesso.'
      );
      fetchStudentTutoringTutorsData();
    } else {
      toast.error('Falha ao desvincular registro. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [del, fetchStudentTutoringTutorsData, response, studentTutoringTutorId]);

  const handleCreateStudentTutoringTutor = useCallback(
    () => navigate('new'),
    [navigate]
  );

  const handleEditStudentTutoringTutor = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchStudentTutoringTutorsData();
  }, [fetchStudentTutoringTutorsData]);

  return (
    <Box>
      <CrudHeader
        title="Monitores vinculados"
        showButton
        onClickButton={handleCreateStudentTutoringTutor}
      />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Monitoria</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell>Monitor</TableCell>
              <TableCell>Última alteração</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {studentTutoringTutors.map((studentTutoringTutor) => (
              <TableRow key={studentTutoringTutor.id}>
                <TableCell component="th">
                  {studentTutoringTutor.student_tutoring?.course_code}
                  {' - '}
                  {studentTutoringTutor.student_tutoring?.course_name}
                </TableCell>
                <TableCell component="th">
                  {studentTutoringTutor.professor?.name}
                </TableCell>
                <TableCell component="th">
                  {studentTutoringTutor.tutor?.name}
                </TableCell>
                <TableCell>
                  {formatDateTime(studentTutoringTutor.updated_at)}
                </TableCell>
                <ActionsCell
                  onClickToggle={() => alert('TODO')}
                  onClickEdit={() =>
                    handleEditStudentTutoringTutor(studentTutoringTutor.id)
                  }
                  onClickDelete={() => handleOpenModal(studentTutoringTutor.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteStudentTutoringTutor}
      />
    </Box>
  );
}

export default StudentTutoringTutorsList;
