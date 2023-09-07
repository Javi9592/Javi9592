import { Grid, ListItemText, Typography } from '@mui/material';
import { Diagnosis, Entry } from '../../types';
import { Icon } from 'semantic-ui-react'


type Diagnoses = { [code: string]: Diagnosis };

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnoses;
}

const Hospital: React.FC<EntryDetailsProps> = ({entry, diagnoses}) => {
return (
    <Grid
      key={entry.id}
      container
      spacing={2}
      sx={{ border: '1px solid #ccc', borderRadius: '8px' }}
    >
      <Grid item lg={12}>
        <Typography style={{fontWeight: 'bold'}}>{entry.date}  <Icon name='hospital' size='big'/></Typography> 
      </Grid>
      <Grid item lg={12}>
        <Typography style={{ color: 'grey' }}>{entry.description}</Typography>
      </Grid>
      {entry.diagnosisCodes?.map((code) => (
        <Grid container spacing={2} key={code}>
          <Grid item lg={1}>
            <ListItemText primary={code} style={{ margin: '1em' }} />
          </Grid>
          <Grid item lg={2}>
            <ListItemText
              style={{ margin: '1em' }}
              secondary={Object.values(diagnoses)
                .filter((diagnose) => diagnose.code === code)
                .map((diagnose) => diagnose.name)}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item lg={1} style={{margin: '0.5em', color: 'red'}}>
          <Icon name='heartbeat'/>
          </Grid>
    </Grid>
)
}
export default Hospital