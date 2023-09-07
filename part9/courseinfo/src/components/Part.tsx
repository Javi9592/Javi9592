import React from 'react';
import { CoursePart } from '../types';

const Part: React.FC<{ courseParts: Array<CoursePart> }> = ({
  courseParts,
}) => {
  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  return (
    <>
      {courseParts.map((part, index) => {
        switch (part.name) {
          case 'Fundamentals':
            return (
              <div key={index}>
                <p>{part.name}</p>
                <p>Exercise Count: {part.exerciseCount}</p>
                <p>Description: {part.description}</p>
              </div>
            );
          case 'Using props to pass data':
            return (
              <div key={index}>
                <p>{part.name}</p>
                <p>Exercise Count: {part.exerciseCount}</p>
                <p>Group Project Count: {part.groupProjectCount}</p>
              </div>
            );
          case 'Deeper type usage':
            return (
              <div key={index}>
                <p>{part.name}</p>
                <p>Exercise Count: {part.exerciseCount}</p>
                <p>Description: {part.description}</p>
                <p>Exercise Submission Link: {part.exerciseSubmissionLink}</p>
              </div>
            );
          case 'Course Part':
            return (
              <div key={index}>
                <p>{part.name}</p>
                <p>Exercise Count: {part.exerciseCount}</p>
                <p>Description: {part.description}</p>
                <p>Steps: {part.steps}</p>
              </div>
            );
          default:
            return assertNever(part);
        }
      })}
    </>
  );
};

export default Part;
