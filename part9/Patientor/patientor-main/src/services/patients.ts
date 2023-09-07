import axios from "axios";
import { Patient, PatientFormValues, InputEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/api/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/api/patients`,
    object
  );

  return data;
};

const addEntry = async (object: InputEntry, id: string) => {
  try {
    const response = await axios.post<Patient>(`${apiBaseUrl}/api/patients/${id}/entries`, object);

    // Verifica si la respuesta contiene datos
    if (response.data) {
      const patient: Patient = response.data;
      return patient;
    } else {
      throw new Error('La respuesta del servidor no contiene datos válidos.');
    }
  } catch (error) {
    throw error;
  }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getAll, create, addEntry
};

