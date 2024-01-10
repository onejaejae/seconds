import { Union } from '../common';

export const SheetType = {
  CUSTOMER: 'customer',
  ORDER: 'order',
};
export type SheetType = Union<typeof SheetType>;
