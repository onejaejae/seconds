import { Injectable } from '@nestjs/common';
import { EntityTarget, Repository } from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor } from 'class-transformer';

@Injectable()
export abstract class SecondBaseRepository<T> {
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getName(): EntityTarget<T>;

  //   async save(entity: DeepPartial<T>) {
  //     return this.getRepository().save(entity);
  //   }

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }
}
