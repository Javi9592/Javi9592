import express from 'express';
const app = express();
app.use(express.json());
import cors from 'cors';
import diagnosesRouter from './src/routes/diagnoses';
import patientsRouter from './src/routes/patients';

app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));

const PORT = 3001;

app.get('/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/patients', patientsRouter);
app.use('/api/diagnoses', diagnosesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});