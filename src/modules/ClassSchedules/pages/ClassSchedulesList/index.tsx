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
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

import { IClassSchedule } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import { DeleteDialog } from '../../../../components/DeleteDialog';
import { dayNumberToString, roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { ActionsCell } from '../../../../components/ActionsCell';

export function ClassSchedulesList(): JSX.Element {
  document.title = 'Horários | Lion';

  const [classSchedules, setClassSchedules] = useState<IClassSchedule[]>([]);
  const [classScheduleId, setClassScheduleId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();

  const { get, del, response } = useFetch('/class-schedules');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchClassSchedulesData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.student_tutor) {
        await get();

        if (response.ok) {
          setClassSchedules(
            (response.data as IClassSchedule[]).filter(
              (item) => item.student_tutoring_tutor_id === id
            )
          );
        } else {
          toast.error(
            'Falha ao obter os dados dos horários. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [authenticated, get, id, response, userAuthenticated.role]);

  const handleOpenModal = useCallback((id: string) => {
    setIsModalOpen(true);
    setClassScheduleId(id);
  }, []);

  const handleDeleteClassSchedule = useCallback(async () => {
    await del(classScheduleId);

    if (response.ok) {
      toast.success('Horário excluído com sucesso.');
      fetchClassSchedulesData();
    } else {
      toast.error('Falha ao excluir registro. Tente novamente mais tarde.');
    }

    setIsModalOpen(false);
  }, [classScheduleId, del, fetchClassSchedulesData, response.ok]);

  const handleCreateClassSchedule = useCallback(
    () => navigate('new'),
    [navigate]
  );

  const handleEditClassSchedule = useCallback(
    (id: string | undefined) => {
      if (id) navigate(id);
    },
    [navigate]
  );

  useEffect(() => {
    fetchClassSchedulesData();
  }, [fetchClassSchedulesData]);

  return (
    <Box>
      <CrudHeader
        title="Meus horários"
        showButton
        onClickButton={handleCreateClassSchedule}
      />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Local de encontro</TableCell>
              <TableCell>Dia da semana</TableCell>
              <TableCell>Horário de início</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {classSchedules.map((classSchedule) => (
              <TableRow key={classSchedule.id}>
                <TableCell component="th">
                  {classSchedule.meeting_place}
                </TableCell>
                <TableCell component="th">
                  {dayNumberToString(classSchedule.day_of_the_week)}
                </TableCell>
                <TableCell component="th">{classSchedule.starts_at}</TableCell>
                <ActionsCell
                  hideToggle
                  onClickEdit={() => handleEditClassSchedule(classSchedule.id)}
                  onClickDelete={() => handleOpenModal(classSchedule.id)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DeleteDialog
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        handleConfirm={handleDeleteClassSchedule}
      />
    </Box>
  );
}

export default ClassSchedulesList;
