import { Injectable } from '@nestjs/common';
import { EntityTarget, Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export abstract class SecondBaseRepository<T> {
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getName(): EntityTarget<T>;

  async createEntity(model: T): Promise<T> {
    const res = await this.getRepository().save(model);
    return plainToInstance(this.classType, res);
  }

  async bulkInsert(model: Array<QueryDeepPartialEntity<T>>): Promise<any> {
    return this.getRepository().insert(model);
  }

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }

  protected getQueryBuilder(): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(String(this.getName()).toLowerCase());
  }

  protected getSubQueryBuilder(subQueryAlias: string): SelectQueryBuilder<T> {
    return this.txManager
      .getEntityManager()
      .getRepository(this.getName())
      .createQueryBuilder(subQueryAlias);
  }
}
