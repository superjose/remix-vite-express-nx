import { CoreException } from 'app/.server/bounded_contexts/core/domain/exceptions.domain';
import { CSRFError } from './csrf';

export class CsrfTokenException extends CoreException {
  constructor(error: CSRFError) {
    super({
      code: `REMIX.CSRF_TOKEN_EXCEPTION_${error.code}`,
      name: 'CsrfTokenException',
      message: error.message,
      error,
    });
  }
}
