import React from 'react';

const Total: React.FC<{ courseParts: Array<{name: string; exerciseCount: number}>}> = ({ courseParts }) => (
  <p>
    Number of exercises{' '}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

export default Total;
