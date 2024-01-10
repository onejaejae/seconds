import { Union } from '../common';

export const OrderType = {
  REFUND: 'refund',
  ORDER: 'order',
};
export type OrderType = Union<typeof OrderType>;
