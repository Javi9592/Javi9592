/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  NewPatient,
  Gender,
  InputEntry,
  typeEntries,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../types';
type SSN = string;

/* eslint-disable @typescript-eslint/no-explicit-any */
const toNewPatientEntry = (object: any): NewPatient => {
  return {
    name: parseString(object.name),
    dateOfBirth: parseDate(object.dateOfBirth),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseString(object.occupation),
  };
};

const toNewEntry = (object: any): InputEntry => {
  const type = parseType(object.type);
  switch (type) {
    case 'HealthCheck':
      return {
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        type: 'HealthCheck',
        diagnosisCodes: object.diagnosisCodes
          ? parseArray(object.diagnosisCodes)
          : undefined,
        healthCheckRating: parseHealthCheck(object.healthCheckRating),
      };
    case 'Hospital':
      return {
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        type: 'Hospital',
        diagnosisCodes: object.diagnosisCodes
          ? parseArray(object.diagnosisCodes)
          : undefined,
        discharge: parseDischarge(object.discharge),
      };
    case 'OccupationalHealthcare':
      return {
        description: parseString(object.description),
        date: parseDate(object.date),
        specialist: parseString(object.specialist),
        type: 'OccupationalHealthcare',
        diagnosisCodes: object.diagnosisCodes
          ? parseArray(object.diagnosisCodes)
          : undefined,
        employerName: parseString(object.employerName),
        sickLeave: object.sickLeave
          ? parseSickLeave(object.sickLeave)
          : undefined,
      };
    default:
      throw new Error('Invalid entry type');
  }
};

const parseSickLeave = (
  object: any,
): OccupationalHealthcareEntry['sickLeave'] => {
  if (
    !object ||
    !object.startDate ||
    !object.endDate ||
    !isString(object.startDate) ||
    !isString(object.endDate)
  ) {
    throw new Error('Incorrect or missing: startDate or endDate');
  }
  return object as OccupationalHealthcareEntry['sickLeave'];
};

const parseDischarge = (object: any): HospitalEntry['discharge'] => {
  if (
    !object ||
    !object.date ||
    !object.criteria ||
    !isString(object.date) ||
    !isString(object.criteria)
  ) {
    throw new Error('Incorrect or missing: date or criteria');
  }
  return object as HospitalEntry['discharge'];
};

const parseHealthCheck = (number: any): HealthCheckRating => {
  if (!number || !isHealthRating(parseInt(number))) {
    throw new Error('Incorrect or missing: ' + number);
  }
  return number as HealthCheckRating;
};

const isHealthRating = (number: any): boolean => {
  return typeof number === 'number' && number >= 0 && number <= 3;
};

const parseArray = (array: any): Array<string> => {
  if (!Array.isArray(array)) {
    throw new Error('diagnosesCodes should be an array.');
  }

  for (const code of array) {
    if (typeof code !== 'string' || !/^[A-Z\d.]+$/.test(code)) {
      throw new Error(`Invalid diagnosis code: ${code}`);
    }
  }
  return array as Array<string>;
};

const isTypeEntry = (text: any): text is typeEntries => {
  return (
    typeof text === 'string' &&
    (text === 'HealthCheck' ||
      text === 'Hospital' ||
      text === 'OccupationalHealthcare')
  );
};

const parseType = (word: any): typeEntries => {
  if (!word || !isString(word) || !isTypeEntry(word)) {
    throw new Error('Incorrect or missing: ' + word);
  }
  return word;
};

const parseString = (word: any): string => {
  if (!word || !isString(word)) {
    throw new Error('Incorrect or missing: ' + word);
  }

  return word;
};

const isString = (text: any): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: any): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing visibility: ' + gender);
  }
  return gender;
};

const isSSN = (param: any): param is SSN => {
  const ssnRegex = /^[0-9]{6}-[0-9]{1,2}[0-9A-Z]{2,2}$/;
  return typeof param === 'string' && ssnRegex.test(param);
};

const parseSsn = (ssn: any): SSN => {
  if (!ssn || !isSSN(ssn)) {
    throw new Error('Incorrect or missing SSN: ' + ssn);
  }
  return ssn;
};

export { toNewPatientEntry, toNewEntry };
