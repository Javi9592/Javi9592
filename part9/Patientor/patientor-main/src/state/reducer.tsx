import { Diagnosis, Patient } from '../types';
import { State } from './state';

export type Action =
  | {
      type: 'SET_PATIENT_LIST';
      payload: Patient[];
    }
  | {
      type: 'ADD_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_PATIENT';
      payload: Patient;
    }
  | {
      type: 'SET_DIAGNOSES_LIST';
      payload: Diagnosis[];
    }
  | {
      type: 'EDIT_PATIENT'; // Nueva acción para editar paciente
      payload: {
        id: string; // ID del paciente que deseas editar
        updatedPatient: Patient; // Objeto con los cambios que deseas aplicar
      };
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PATIENT_LIST':
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {},
          ),
          ...state.patients,
        },
      };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload,
        },
      };
    case 'SET_PATIENT':
      return {
        ...state,
        patient: {
          ...state.patient,
          [action.payload.id]: action.payload,
        },
      };
    case 'EDIT_PATIENT':
      // Obtén el ID del paciente que deseas editar
      const patientIdToEdit = action.payload.id;
      // Obtén el nuevo objeto de paciente que contiene los cambios
      const updatedPatient = action.payload.updatedPatient;
      return {
        ...state,
        patients: {
          ...state.patients,
          [patientIdToEdit]: updatedPatient, // Actualiza el paciente con los cambios
        },
        patient: {
          ...state.patient,
          [patientIdToEdit]: updatedPatient, // Actualiza el paciente individual
        },
      };
    case 'SET_DIAGNOSES_LIST':
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {},
          ),
          ...state.diagnoses,
        },
      };
    default:
      return state;
  }
};

export const setPatientList = (patients: Patient[]): Action => ({
  type: 'SET_PATIENT_LIST',
  payload: patients,
});

export const addPatient = (patient: Patient): Action => ({
  type: 'ADD_PATIENT',
  payload: patient,
});

export const setPatient = (patient: Patient): Action => ({
  type: 'SET_PATIENT',
  payload: patient,
});

export const setDiagnoses = (diagnoses: Diagnosis[]): Action => ({
  type: 'SET_DIAGNOSES_LIST',
  payload: diagnoses,
});
