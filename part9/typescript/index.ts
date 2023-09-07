import express from 'express';
import { argumentsForBmi, calculateBmi } from './bmiCalculator';
import { argumentsTraining, calculateExercises } from './exerciseCalculator';
const app = express();
app.use(express.json());

interface ExerciseData {
  daily_exercises: Array<number>;
  target: number;
}

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const heightStr = req.query.height?.toString();
  const weightStr = req.query.weight?.toString();

  if (!heightStr || !weightStr) {
    res.status(400).send('Debes proporcionar altura y peso.');
    return;
  }
  try {
    const { value1: height, value2: weight } = argumentsForBmi([
      heightStr,
      weightStr,
    ]);
    res.send({
      weight: weight,
      height: height,
      bmi: calculateBmi(height, weight),
    });
  } catch (e) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  const exerciseData = req.body as ExerciseData;
  if (!exerciseData) {
    res.status(400).send('Debes proporcionar los datos.');
    return;
  }
  try {
    const arrayArguments: number[] = argumentsTraining(exerciseData);
    const result = calculateExercises(arrayArguments);
    res.send(result);
  } catch (e) {
    res.status(400).send({ error: 'malformatted parameters' });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
