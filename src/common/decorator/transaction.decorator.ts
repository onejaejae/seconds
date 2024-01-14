import { InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';
import { TRANSACTION } from '../const/transaction';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export function Transactional() {
  return function (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    // save original method
    const originMethod = descriptor.value;

    // wrapped origin method with Transaction
    async function transactionWrapped(...args: unknown[]) {
      if (isTestEnvironment) {
        return await originMethod.apply(this, args);
      }

      // validate nameSpace && get nameSpace
      const nameSpace = getNamespace(TRANSACTION.NAMESPACE);
      if (!nameSpace || !nameSpace.active)
        throw new InternalServerErrorException(
          `${TRANSACTION.NAMESPACE} is not active`,
        );

      // get EntityManager
      const em = nameSpace.get(TRANSACTION.ENTITY_MANAGER) as EntityManager;
      if (!em)
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${TRANSACTION.NAMESPACE} nameSpace`,
        );

      return await em.transaction(async (tx: EntityManager) => {
        nameSpace.set(TRANSACTION.ENTITY_MANAGER, tx);
        return await originMethod.apply(this, args);
      });
    }

    descriptor.value = transactionWrapped;
  };
}
