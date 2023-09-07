import React from 'react';
import { CoursePart } from '../types';
import Part from './Part';

const Content: React.FC<{ courseParts: Array<CoursePart> }> = ({ courseParts }) => {
  return (
    <>
    <Part courseParts={courseParts}/>
    </>
  );
};

export default Content;
