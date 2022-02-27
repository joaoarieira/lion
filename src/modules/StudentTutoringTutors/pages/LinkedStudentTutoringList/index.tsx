import { EditOutlined } from '@mui/icons-material';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

import { IStudentTutoringTutor } from '../../../../@types/entities';
import { CrudHeader } from '../../../../components/CrudHeader';
import TableButton from '../../../../components/TableButton';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';

export function LinkedStudentTutoringList(): JSX.Element {
  document.title = 'Monitorias | Lion';

  const [studentTutoringTutors, setStudentTutoringTutors] = useState<
    IStudentTutoringTutor[]
  >([]);

  const { get, response } = useFetch('/student-tutoring-tutors');
  const { authenticated, userAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchStudentTutoringTutorsData = useCallback(async () => {
    if (authenticated) {
      if (userAuthenticated.role === roleNames.student_tutor) {
        await get(`?tutor_id=${userAuthenticated.id}`);

        if (response.ok) {
          setStudentTutoringTutors(response.data);
        } else {
          toast.error(
            'Falha ao obter os dados das monitorias. Tente novamente mais tarde.'
          );
        }
      }
    }
  }, [
    authenticated,
    get,
    response,
    userAuthenticated.id,
    userAuthenticated.role,
  ]);

  useEffect(() => {
    fetchStudentTutoringTutorsData();
  }, [fetchStudentTutoringTutorsData]);

  return (
    <Box>
      <CrudHeader title="Minhas monitorias" />

      <TableContainer component={Paper}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Monitoria</TableCell>
              <TableCell>Professor</TableCell>
              <TableCell align="right">Meus horários</TableCell>
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
                <TableCell align="right">
                  <TableButton
                    onClick={() =>
                      navigate(`${studentTutoringTutor.id}/class-schedules`)
                    }
                  >
                    <EditOutlined
                      fontSize="small"
                      sx={{ marginRight: '0.5rem' }}
                    />
                    <Typography variant="caption" fontSize={13}>
                      GERENCIAR
                    </Typography>
                  </TableButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default LinkedStudentTutoringList;
