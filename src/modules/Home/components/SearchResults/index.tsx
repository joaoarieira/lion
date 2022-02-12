import { ChevronRightOutlined } from '@mui/icons-material';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

import { IStudentTutoringTutor } from '../../../../@types/entities';
import { DetailsAction } from './styles';

export function SearchResults(): JSX.Element {
  document.title = 'Pesquisa | Lion';

  const [studentTutoringsTutors, setStudentTutoringTutors] = useState<
    IStudentTutoringTutor[]
  >([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const query = searchParams.get('query');

  const { get, response } = useFetch();

  const handleClickDetails = useCallback(
    (id: string) => {
      navigate(`/details/${id}`);
    },
    [navigate]
  );

  const fetchStudentTutoringsTutors = useCallback(async () => {
    await get('/student-tutoring-tutors');

    if (response.ok) {
      setStudentTutoringTutors(response.data);
    } else {
      toast.error('Falha ao pesquisar. Tente novamente mais tarde.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, JSON.stringify(response.data), response.ok]);

  useEffect(() => {
    fetchStudentTutoringsTutors();
  }, [fetchStudentTutoringsTutors]);

  return (
    <Box flexGrow={1}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        spacing={1.5}
      >
        {studentTutoringsTutors.map((studentTutoringTutor) => (
          <Grid key={studentTutoringTutor.id} item xs={12}>
            <Paper elevation={3} sx={{ maxWidth: '400px', margin: 'auto' }}>
              <Box sx={{ p: '1rem' }}>
                <Grid container>
                  <Grid item xs={10}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1">
                          {`${studentTutoringTutor.student_tutoring?.course_code} - 
                          ${studentTutoringTutor.student_tutoring?.course_name}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2">
                          {`Monitor: ${studentTutoringTutor.tutor?.name}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="caption">
                          {`Prof.: ${
                            studentTutoringTutor.student_tutoring?.professor
                              ?.name ?? ''
                          }`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    display="flex"
                    justifyContent="flex-end"
                    width="100%"
                  >
                    <DetailsAction
                      onClick={() =>
                        handleClickDetails(studentTutoringTutor.id)
                      }
                    >
                      <ChevronRightOutlined />
                    </DetailsAction>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SearchResults;
