import { Button, ButtonGroup, Container, Fab, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import useFetch from 'use-http';
import AddIcon from '@mui/icons-material/Add';

interface ICampus {
  id: string;
  name: string;
}

export function Campuses(): JSX.Element {
  const [campuses, setCampuses] = useState<ICampus[]>([]);
  const { get, response } = useFetch();

  const fetchCampuses = useCallback(async () => {
    await get('/campuses');
    if (response.ok) {
      setCampuses(response.data);
    } else {
      console.log(response);
    }
  }, [get, response]);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  return (
    <Container>
      <Typography variant="h5" component="h1" gutterBottom>
        Campuses
      </Typography>
      <div>
        {campuses.map((campus) => (
          <div key={campus.id}>{campus.name}</div>
        ))}
      </div>

      <ButtonGroup>
        <Button variant="contained">Um</Button>
        <Button variant="outlined">Dois</Button>
      </ButtonGroup>

      <Fab
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        aria-label="Criar"
        color="primary"
        size="small"
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

export default Campuses;
