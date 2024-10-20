import { CoreException } from "app/.server/bounded_contexts/core/domain/exceptions.domain";

export class RemixAuthNotFoundException extends CoreException {
  /**
   *
   */
  constructor() {
    super({
      name: 'RemixAuthNotFoundException',
      code: 'AUTH.NOT_FOUND',
      message: 'Not Found Exception',
      error: new Error('Not Found Exception'),
    });
  }
}
