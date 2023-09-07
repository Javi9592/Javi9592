import patientsData from '../data/patients';
import { Patient, NewPatient, PublicPatient, InputEntry } from '../../types';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const newIdForPatient: string = uuidv4() as string;
const newIdForEntry: string = uuidv4();

const patients: Array<Patient> = patientsData;

const getEntries = (): Array<Patient> => {
  return patients;
};

const getPatient = (id : string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const getNonSensitiveEntriesPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    entries: [],
    id: newIdForPatient,
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: InputEntry, patientId: string): Patient => {
  const newEntry = {
    id: newIdForEntry,
    ...entry
  };
  const patientToEditIndex = patients.findIndex((patient) => patient.id === patientId);

  if (patientToEditIndex === -1) {
    throw new Error(`No se encontró un paciente con el ID ${patientId}`);
  }

  // Clonar el paciente antes de modificarlo para evitar mutaciones no deseadas
  const patientToEdit = { ...patients[patientToEditIndex] };

  // Actualizar la lista de entradas del paciente clonado
  patientToEdit.entries.push(newEntry);

  // Actualizar la lista de pacientes con el paciente modificado
  patients[patientToEditIndex] = patientToEdit;

  return patientToEdit;
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntriesPatients,
  getPatient,
  addEntry,
};
