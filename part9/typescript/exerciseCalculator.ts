interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface objectValue {
  daily_exercises: Array<number>,
  target: number
}

export const argumentsTraining = (exercises: objectValue): number[] => {
  if (!exercises.daily_exercises || exercises.daily_exercises.length === 0) {
    throw new Error('No daily_exercises provided');
  }
  if (!exercises.target) {
    throw new Error('No target provided');
  }
  if (isNaN(Number(exercises.target))) {
    throw new Error('Target is not a Number');
  }

  const values = [];

  for (let i = 0; i < exercises.daily_exercises.length; i++) {
    if (isNaN(Number(exercises.daily_exercises[i]))) {
      throw new Error('Provided values were not numbers!');
    }
    values.push(Number(exercises.daily_exercises[i]));
  }

  values.push(Number(exercises.target));
  return values;
};

export const calculateExercises = (training: Array<number>): Result => {
  const exercisesDay = training.slice(0, training.length - 1);
  let countDays = 0;
  const averageTraining =
    exercisesDay.reduce((acc, hoursDay) => acc + hoursDay, 0) /
    exercisesDay.length;
  exercisesDay.map((day) => {
    if (day !== 0) {
      countDays++;
    }
  });

  let response = '';
  let success = false;

  if (averageTraining < 1.5) {
    response = 'bad';
  } else if (averageTraining < 2 && averageTraining >= 1.5) {
    response = 'not too bad but could be better';
  } else if (averageTraining >= 2) {
    success = true;
    response = 'you rocket it';
  }

  const result = {
    periodLength: training.length - 1,
    trainingDays: countDays,
    success: success,
    rating: Math.round(averageTraining),
    ratingDescription: response,
    target: training[training.length-1],
    average: averageTraining,
  };

  console.log(result);
  return result;
};
