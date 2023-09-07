import { useParams } from 'react-router-dom';
import { useStateValue } from '../state/state';
import React, { useState } from 'react';
import { apiBaseUrl } from '../constants';
import axios from 'axios';
import { Diagnosis, InputEntry, Patient } from '../types';
import { Grid, Typography } from '@mui/material';
import { Male, Female, Transgender } from '@mui/icons-material';
import { setDiagnoses, setPatient } from '../state/reducer';
import EntryDetails from './PatientListPage/EntryDetails';
import { Button } from 'semantic-ui-react';
import AddEntryModal from './AddEntryModal';
import patientsService from '../services/patients'

const Patientor = () => {
  const { id } = useParams<{ id: string }>();

  const [{ patient }, dispatch] = useStateValue();
  const [{ diagnoses }] = useStateValue();

  const [modalEntryOpen, setModalEntryOpen] = useState<boolean>(false);

  const openEntryModal = (): void => setModalEntryOpen(true);

  const closeEntryModal = (): void => {
    setModalEntryOpen(false);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/api/patients/${id}`,
        );
        dispatch(setPatient(patient));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatient();
  }, [dispatch, id]);

  React.useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data: diagnoses } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}/api/diagnoses`,
        );
        dispatch(setDiagnoses(diagnoses));
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiagnoses();
  }, [dispatch]);

  const submitNewEntry = async (values: InputEntry) => {
    try {
      const editPatient = await patientsService.addEntry(values, id as string);
      dispatch({
        type: 'EDIT_PATIENT',
        payload: {
          id: id as string, // Reemplaza con el ID del paciente que deseas editar
          updatedPatient: editPatient, // Proporciona aquí los cambios que deseas aplicar al paciente
        },
      });
      closeEntryModal();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === 'string') {
          const message = e.response.data.replace(
            'Something went wrong. Error: ',
            '',
          );
          console.error(message);
        }
      } else {
        console.error('Unknown error', e);
      }
    }
  };

  const dataPatient = patient[id || ''];

  if (!patient || !dataPatient) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Typography
        variant='h4'
        style={{ marginTop: '0.5em', fontWeight: 'bold' }}
      >
        {dataPatient.name}{' '}
        {dataPatient.gender === 'male' ? (
          <Male fontSize='inherit' />
        ) : dataPatient.gender === 'female' ? (
          <Female fontSize='inherit' />
        ) : (
          <Transgender fontSize='inherit' />
        )}
      </Typography>
      <Typography>ssn: {dataPatient.ssn}</Typography>
      <Typography>occupation: {dataPatient.occupation}</Typography>
      <Typography variant='h6' style={{ margin: '1em', fontWeight: 'bold' }}>
        Entries
      </Typography>
      {dataPatient.entries.map((entry, id) => (
        <Grid key={id}>
          <EntryDetails entry={entry} diagnoses={diagnoses} />
          <br />
        </Grid>
      ))}
      <br />
      <AddEntryModal
        modalEntryOpen={modalEntryOpen}
        onClose={closeEntryModal}
        onSubmit={submitNewEntry}
        diagnoses={diagnoses}
      />
      <Button variant='contained' onClick={() => openEntryModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default Patientor;
