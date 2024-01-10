import { Union } from '../common';

export const GradeType = {
  A: 'A',
  B: 'B',
  C: 'C',
};
export type GradeType = Union<typeof GradeType>;
