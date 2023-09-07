import diagnoseData from '../data/diagnoses.json';
import { Diagnose } from '../../types';

const diagnose: Array<Diagnose> = diagnoseData as Array<Diagnose>;

const getEntries = (): Array<Diagnose> => {
  return diagnose;
};


const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
