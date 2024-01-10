import { Injectable } from '@nestjs/common';
import { EntityTarget, Repository } from 'typeorm';
import { TransactionManager } from './transaction.manager';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export abstract class SecondBaseRepository<T> {
  protected abstract readonly txManager: TransactionManager;

  constructor(private readonly classType: ClassConstructor<T>) {}

  abstract getName(): EntityTarget<T>;

  async createEntity(model: T): Promise<T> {
    const res = await this.getRepository().save(model);
    return plainToInstance(this.classType, res);
  }

  protected getRepository(): Repository<T> {
    return this.txManager.getEntityManager().getRepository(this.getName());
  }
}
