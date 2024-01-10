import { Union } from '../common';

export const GradeType = {
  A: 'a',
  B: 'b',
  C: 'c',
};
export type GradeType = Union<typeof GradeType>;
