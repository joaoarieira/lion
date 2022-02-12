import {
  AlternateEmailOutlined,
  SchoolOutlined,
  PersonOutlineOutlined,
  DateRangeOutlined,
  LocationOnOutlined,
  HeadsetMicOutlined,
  WatchLaterOutlined,
  NoteAltOutlined,
} from '@mui/icons-material';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useFetch from 'use-http';

import { IStudentTutoringTutor } from '../../@types/entities';
import { dayNumberToString, isUUID } from '../../helpers';
import { SingleInfo } from './components/SingleInfo';
import { CourseNamePaper, InfoContainer, SchedulesBox } from './styles';

export function StudentTutoringTutorDetails(): JSX.Element {
  const [studentTutoringTutor, setStudentTutoringTutor] =
    useState<IStudentTutoringTutor>();
  const [programsNames, setProgramsNames] = useState<string[]>([]);

  const { id } = useParams();
  const { get, response } = useFetch('student-tutoring-tutors');
  const navigate = useNavigate();

  const fetchStudentTutoringTutor = useCallback(async () => {
    if (isUUID(id)) {
      await get(id);

      if (response.ok) {
        setStudentTutoringTutor(response.data);
        const studentTutoringPrograms = (response.data as IStudentTutoringTutor)
          .student_tutoring?.student_tutoring_programs;

        if (studentTutoringPrograms) {
          const newProgramsNames = [] as string[];

          studentTutoringPrograms.forEach((studentTutoringProgram) => {
            if (studentTutoringProgram)
              if (studentTutoringProgram.program) {
                newProgramsNames.push(studentTutoringProgram.program.name);
              }
          });

          setProgramsNames(newProgramsNames);
        }
      } else {
        toast.error('Falha ao obter os detalhes. Tente novamente mais tarde.');
      }
    } else {
      navigate('/404');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, id, JSON.stringify(response.data), response.ok]);

  useEffect(() => {
    fetchStudentTutoringTutor();
  }, [fetchStudentTutoringTutor]);

  return (
    <Box flexGrow={1}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        alignContent="center"
        sx={{ maxWidth: '400px', margin: 'auto', rowGap: '1rem' }}
      >
        {/*         
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h6" component="h1">
            Detalhes
          </Typography>
        </Grid> 
        */}

        <Grid item xs={12}>
          <CourseNamePaper variant="outlined">
            <Box sx={{ p: '0.5rem' }}>
              <Typography component="h2" variant="body1" fontWeight={500}>
                {`${studentTutoringTutor?.student_tutoring?.course_code} - 
                ${studentTutoringTutor?.student_tutoring?.course_name}`}
              </Typography>
            </Box>
          </CourseNamePaper>
        </Grid>

        <InfoContainer item xs={12}>
          <SingleInfo
            icon={
              <PersonOutlineOutlined
                fontSize="small"
                sx={{ color: grey[700] }}
              />
            }
            label="Monitor"
            value={studentTutoringTutor?.tutor?.name}
          />
          <SingleInfo
            icon={
              <AlternateEmailOutlined
                fontSize="small"
                sx={{ color: grey[700] }}
              />
            }
            label="Email"
            value={studentTutoringTutor?.tutor?.email}
            isValueEmail
          />
        </InfoContainer>

        <InfoContainer item xs={12}>
          <SingleInfo
            icon={
              <PersonOutlineOutlined
                fontSize="small"
                sx={{ color: grey[700] }}
              />
            }
            label="Prof."
            value={studentTutoringTutor?.student_tutoring?.professor?.name}
          />
          <SingleInfo
            icon={
              <AlternateEmailOutlined
                fontSize="small"
                sx={{ color: grey[700] }}
              />
            }
            label="Email"
            value={studentTutoringTutor?.student_tutoring?.professor?.email}
            isValueEmail
          />
        </InfoContainer>

        <InfoContainer item xs={12}>
          <SingleInfo
            icon={<SchoolOutlined fontSize="small" sx={{ color: grey[700] }} />}
            label="Cursos"
            value={programsNames.join(', ')}
          />
        </InfoContainer>

        {studentTutoringTutor?.class_schedules &&
          studentTutoringTutor.class_schedules.length > 0 && (
            <InfoContainer item xs={12}>
              <Paper
                variant="outlined"
                sx={{ backgroundColor: 'transparent', margin: '0 1rem' }}
              >
                <SchedulesBox>
                  {studentTutoringTutor.class_schedules.map(
                    (class_schedule) => (
                      <InfoContainer key={class_schedule.id} item xs={12}>
                        <SingleInfo
                          icon={
                            <DateRangeOutlined
                              fontSize="small"
                              sx={{ color: grey[700] }}
                            />
                          }
                          label="Dia"
                          value={dayNumberToString(
                            class_schedule.day_of_the_week
                          )}
                        />

                        <SingleInfo
                          icon={
                            <LocationOnOutlined
                              fontSize="small"
                              sx={{ color: grey[700] }}
                            />
                          }
                          label="Local"
                          value={class_schedule.meeting_place}
                        />

                        {class_schedule.meeting_url && (
                          <SingleInfo
                            icon={
                              <HeadsetMicOutlined
                                fontSize="small"
                                sx={{ color: grey[700] }}
                              />
                            }
                            label="Link de acesso"
                            value={class_schedule.meeting_url}
                            isValueURL
                          />
                        )}

                        {class_schedule.starts_at &&
                          !class_schedule.ends_at && (
                            <SingleInfo
                              icon={
                                <WatchLaterOutlined
                                  fontSize="small"
                                  sx={{ color: grey[700] }}
                                />
                              }
                              label="Começa"
                              value={class_schedule.starts_at}
                            />
                          )}

                        {class_schedule.starts_at && class_schedule.ends_at && (
                          <SingleInfo
                            icon={
                              <WatchLaterOutlined
                                fontSize="small"
                                sx={{ color: grey[700] }}
                              />
                            }
                            label="Período"
                            value={`${class_schedule.starts_at} ~ ${class_schedule.ends_at}`}
                          />
                        )}

                        {class_schedule.note && (
                          <SingleInfo
                            icon={
                              <NoteAltOutlined
                                fontSize="small"
                                sx={{ color: grey[700] }}
                              />
                            }
                            label="Obervação"
                            value={`- ${class_schedule.note}`}
                            isValueLarge
                          />
                        )}
                      </InfoContainer>
                    )
                  )}
                </SchedulesBox>
              </Paper>
            </InfoContainer>
          )}
      </Grid>
    </Box>
  );
}

export default StudentTutoringTutorDetails;
