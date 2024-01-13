import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  bulkInsert(model: Array<QueryDeepPartialEntity<T>>);
}
