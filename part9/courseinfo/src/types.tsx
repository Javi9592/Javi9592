interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartOne extends CoursePartWithDescription {
  name: 'Fundamentals';
  description: string;
}

interface CoursePartTwo extends CoursePartBase {
  name: 'Using props to pass data';
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartWithDescription {
  name: 'Deeper type usage';
  description: string;
  exerciseSubmissionLink: string;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CourseCustomParts {
  name: 'Course Part';
  exerciseCount: number;
  description: string;
  steps: number;
}

export type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CourseCustomParts;