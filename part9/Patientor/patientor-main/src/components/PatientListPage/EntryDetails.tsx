import { Diagnosis, Entry } from '../../types';
import Hospital from '../typesEntries/Hospital';
import HealthCheckEntry from '../typesEntries/HealthCheckEntry';
import OccupationalHealthcareEntry from '../typesEntries/OccupationalHealthcareEntry';

type Diagnoses = { [code: string]: Diagnosis };

interface EntryDetailsProps {
  entry: Entry;
  diagnoses: Diagnoses;
}

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry, diagnoses }) => {
  switch (entry.type) {
    case 'Hospital':
      return <Hospital entry={entry} diagnoses={diagnoses} />;
    case 'HealthCheck':
      return <HealthCheckEntry entry={entry} diagnoses={diagnoses} />;
    case 'OccupationalHealthcare':
      return (
        <OccupationalHealthcareEntry entry={entry} diagnoses={diagnoses} />
      );
  }
};
export default EntryDetails;
