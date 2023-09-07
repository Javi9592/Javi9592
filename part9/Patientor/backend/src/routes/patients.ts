import express from 'express';
import patientsService from '../service/patientsService';
import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitiveEntriesPatients());
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addPatient = patientsService.addPatient(newPatientEntry);
    res.json(addPatient);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(e.message);
  }
});

router.get('/:id', (req, res) => {
  const id: string = req.params.id;
  res.send(patientsService.getPatient(id));
});

router.post('/:id/entries', (req,res) => {
  const id: string = req.params.id;
  try {
    const entry = toNewEntry(req.body);
    const addEntry = patientsService.addEntry(entry, id);
    res.json(addEntry);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(e.message);
  }
});

export default router;
