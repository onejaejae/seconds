import { Injectable, NestMiddleware } from '@nestjs/common';
import { createNamespace, getNamespace } from 'cls-hooked';
import { NextFunction } from 'express';
import { EntityManager } from 'typeorm';
import { TRANSACTION } from '../const/transaction';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly em: EntityManager) {}

  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace =
      getNamespace(TRANSACTION.NAMESPACE) ??
      createNamespace(TRANSACTION.NAMESPACE);

    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(() => this.setEntityManager())
        .then(next);
    });
  }

  private setEntityManager() {
    const namespace = getNamespace(TRANSACTION.NAMESPACE)!;
    namespace.set(TRANSACTION.ENTITY_MANAGER, this.em);
  }
}
