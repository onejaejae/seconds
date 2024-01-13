import { ValueTransformer } from 'typeorm';
import * as moment from 'moment-timezone';

export class LocalDateTransformer implements ValueTransformer {
  // entity -> db로 넣을때
  to(entityValue: Date): Date {
    return entityValue;
  }

  // db -> entity로 가져올때
  from(databaseValue: Date): string {
    console.log('databaseValue', databaseValue);
    console.log('test', moment(databaseValue).format('YYYY-MM-DD'));

    return moment(databaseValue).format('YYYY-MM-DD');
  }
}
