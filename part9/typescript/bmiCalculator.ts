interface Values {
  value1: number;
  value2: number;
}

export const argumentsForBmi = (args: Array<string>): Values => {
  if (args.length < 2) throw new Error('Not enough arguments');
  if (args.length > 2) throw new Error('Too many arguments');

  if (!isNaN(Number(args[0])) && !isNaN(Number(args[1]))) {
    return {
      value1: Number(args[0]),
      value2: Number(args[1]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (high: number, weigth: number) => {
  const highM = high / 100;
  const result = weigth / (highM * highM);
  if (result < 18.5) {
    return 'Underweight';
  } else if (result < 25 && result > 18.5) {
    return 'Normal (healthy weight)';
  } else {
    return 'Overweight';
  }
};
