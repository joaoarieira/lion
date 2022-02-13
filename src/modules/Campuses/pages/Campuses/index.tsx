import {
  DeleteOutlined,
  EditOutlined,
  PowerSettingsNewOutlined,
} from '@mui/icons-material';
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
import { toast } from 'react-toastify';
import useFetch from 'use-http';
import { ICampus } from '../../../../@types/entities';
import CrudHeader from '../../../../components/CrudHeader';
import { roleNames } from '../../../../helpers';
import { useAuth } from '../../../../hooks/AuthContext';
import { StyledTableContainer } from './styles';

export function Campuses(): JSX.Element {
  const [campuses, setCampuses] = useState<ICampus[]>([]);

  const { get, response } = useFetch('/campuses');
  const { authenticated, userAuthenticated } = useAuth();

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

  useEffect(() => {
    fetchCampusesData();
  }, [fetchCampusesData]);

  return (
    <Box>
      <CrudHeader title="Campi" />

      <TableContainer component={StyledTableContainer}>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell>Campus</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell component="th">{campus.name}</TableCell>
                <TableCell align="right">
                  <PowerSettingsNewOutlined fontSize="small" />
                  <EditOutlined fontSize="small" />
                  <DeleteOutlined fontSize="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Campuses;
