import { Formik, Form, Field, FieldArray } from 'formik';
import { Button, Dropdown, Grid, Input } from 'semantic-ui-react';
import { Diagnosis, InputEntry } from '../../types';
import { Typography } from '@mui/material';

interface Props {
  onSubmit: (values: InputEntry) => void;
  onCancel: () => void;
  diagnoses: Diagnoses;
}

type Diagnoses = { [code: string]: Diagnosis };

const typeInput = ['HealthCheck', 'Hospital', 'OccupationalHealthcare'];

const initialFormValues: Record<string, InputEntry> = {
  HealthCheck: {
    type: 'HealthCheck',
    description: '',
    date: '',
    specialist: '',
    diagnosisCodes: [],
    healthCheckRating: 1,
  },
  Hospital: {
    type: 'Hospital',
    description: '',
    date: '',
    specialist: '',
    diagnosisCodes: [],
    discharge: { date: '', criteria: '' },
  },
  OccupationalHealthcare: {
    type: 'OccupationalHealthcare',
    description: '',
    date: '',
    specialist: '',
    diagnosisCodes: [],
    employerName: '',
    sickLeave: { startDate: '', endDate: '' },
  },
};

export const AddEntryForm: React.FC<Props> = ({
  onSubmit,
  onCancel,
  diagnoses,
}) => {
  return (
    <Formik
      initialValues={initialFormValues.HealthCheck}
      enableReinitialize={true}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (!values.specialist) {
          errors.specialist = requiredError;
        }
        if (!values.type) {
          errors.type = requiredError;
        }

        if (values.type === 'HealthCheck') {
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
        } else if (values.type === 'Hospital') {
          if (!values.discharge) {
            errors.discharge = requiredError;
          } else {
            if (!values.discharge.date || !values.discharge.criteria) {
              errors.discharge = 'Both date and criteria are required';
            }
          }
        } else if (values.type === 'OccupationalHealthcare') {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (!values.sickLeave) {
            errors.sickLeave = requiredError;
          } else {
            if (!values.sickLeave.startDate || !values.sickLeave.endDate) {
              errors.sickLeave = 'Both startDate and endDate are required';
            }
          }
        }

        return errors;
      }}
    >
      {({ isValid, values, errors, setFieldValue }) => {
        return (
          <Form className='form ui'>
            <Field as='select' name='type'>
              {typeInput.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
            <Field
              label='Description'
              placeholder='Description'
              name='description'
            />
            <Field label='Date' placeholder='YYYY-MM-DD' name='date' />
            <Field
              label='Specialist'
              placeholder='Specialist'
              name='specialist'
            />
            <FieldArray name='diagnosisCodes'>
              {({ push, remove }: any) => (
                <div>
                  <Typography>Diagnosis Codes</Typography>
                  {values.diagnosisCodes?.map((_code, index) => (
                    <div key={index}>
                      <Field
                        name={`diagnosisCodes[${index}]`}
                        component={Dropdown}
                        search
                        selection
                        options={Object.values(diagnoses)
                          .map((diagnose) => diagnose.code)
                          .map((code) => ({ value: code, text: code }))}
                        onChange={(_e: any, { value }: any) => {
                          setFieldValue(`diagnosisCodes[${index}]`, value);
                        }}
                      />
                      <Button type='button' onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type='button' onClick={() => push('')}>
                    Add Diagnosis Code
                  </Button>
                </div>
              )}
            </FieldArray>
            {values.type === 'HealthCheck' && (
              <>
                {/* Renderizar campos específicos para HealthCheck */}
                <Typography>Health Check Rating</Typography>
                <Field
                  as='select'
                  label='HealthCheckRating'
                  name='healthCheckRating'
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </Field>
              </>
            )}

            {values.type === 'Hospital' && (
              <>
                {/* Renderizar campos específicos para Hospital */}
                <Typography>Discharge</Typography>
                <Field
                  label='Date'
                  placeholder='YYYY-MM-DD'
                  name='discharge.date'
                  as={Input}
                />
                <Field
                  label='Criteria'
                  placeholder='Criteria'
                  name='discharge.criteria'
                  as={Input}
                />
              </>
            )}
            {values.type === 'OccupationalHealthcare' && (
              <>
                {/* Renderizar campos específicos para OccupationalHealthcare */}
                <Field
                  label='EmployerName'
                  placeholder='Employer Name'
                  name='employerName'
                />
                <br />
                <>
                  <Field
                    label='Start'
                    placeholder='YYYY-MM-DD'
                    name='sickLeave.startDate'
                    as={Input}
                  />
                  <Field
                    label='End'
                    placeholder='YYYY-MM-DD'
                    name='sickLeave.endDate'
                    as={Input}
                  />
                </>
              </>
            )}
            <hr />
            {Object.keys(errors).length > 0 && (
              <div>
                <Typography variant='subtitle2' color='error'>
                  Por favor, corrige los siguientes errores:
                </Typography>
                <ul>
                  {Object.values(errors).map((error, index) => (
                    <Typography key={index} color='error'>
                      {String(error)}
                    </Typography>
                  ))}
                </ul>
              </div>
            )}
            <Grid>
              <Grid.Column floated='left' width={5}>
                <Button type='button' onClick={onCancel} color='red'>
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated='right' width={5}>
                <Button
                  type='submit'
                  floated='right'
                  color='green'
                  disabled={!isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
