import { ExceptionLog, FieldErrors } from './types';
import { ZodError } from 'zod';
import { Result } from 'oxide.ts';

export type CoreExceptionInput = {
  code: string;
  name: string;
  message?: string;
  error?: Error;
  meta?: Record<string, unknown>;
};

export type ExceptionLog = {
  name: string;
    message: string;
    code: string;
    stack?: string;
    cause?: unknown;
    meta?: Record<string, unknown>;
    metaString?: string;
  };

export type PromiseResult<Success, Failure> = Promise<Result<Success, Failure>>

export type PromiseExceptionResult<Success, Failure = never> = Promise<
  Result<Success, Failure | ForbiddenException | InternalServerException>
>

export type IException = {
  name: string;
};
export abstract class CoreException extends Error implements IException {
  code: string;
  meta?: Record<string, unknown>;
  override name: string;
  constructor(input: CoreExceptionInput) {
    const codeMsg = `${input.code}: ${input.message}`;
    super(codeMsg, input.error);
    this.code = input.code;
    this.meta = input.meta;
    this.name = input.name;
    if (input.error?.stack) {
      this.stack = input.error?.stack;
    }
    if (input.error?.cause) {
      this.cause = input.error?.cause;
    }
  }
  toLog(): ExceptionLog {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
      cause: this.cause,
      meta: this.meta,
      metaString: this.meta ? JSON.stringify(this.meta) : undefined,
    };
  }
}

export class InternalServerException extends CoreException {
  constructor(message?: string | Error) {
    super({
      code: 'GENERIC.INTERNAL_SERVER_EXCEPTION',
      name: 'InternalServerException',
      message: typeof message === 'string' ? message : undefined,
      error: typeof message === 'object' ? message : undefined,
    });
  }
}

export class NotFoundException extends CoreException {
  constructor(message?: string | Error) {
    super({
      code: 'GENERIC.NOT_FOUND_EXCEPTION',
      name: 'NotFoundException',
      message: typeof message === 'string' ? message : undefined,
      error: typeof message === 'object' ? message : undefined,
    });
  }
}

export class ForbiddenException extends CoreException {
  rules?: unknown;
  constructor(resource: string) {
    super({
      code: 'GENERIC.FORBIDDEN_EXCEPTION',
      name: 'ForbiddenException',
      message: `Tried to access resource: ${resource} but didn't have enough permissions`,
    });
  }
}

export type InvalidStatusExceptionMetadata = {
  expected: string[];
  actual: string;
};

export class InvalidStatusException extends CoreException {
  override meta: InvalidStatusExceptionMetadata =
    {} as InvalidStatusExceptionMetadata;

  constructor(meta: InvalidStatusExceptionMetadata) {
    super({
      code: 'GENERIC.INVALID_STATUS_EXCEPTION',
      name: 'InvalidStatusException',
      message: `The status of the aggregate was invalid.`,
      meta: meta,
    });
    this.meta = meta;
  }
}

export class ValidationException<T> extends CoreException {
  zodError: ZodError<T>;
  errors: FieldErrors<T>;
  constructor(error: ZodError<T>) {
    super({
      code: 'GENERIC.VALIDATION_EXCEPTION',
      name: 'ValidationException',
      error: new Error('VALIDATION_EXCEPTION'),
    });
    const fieldErrors = error.formErrors.fieldErrors;
    this.errors = fieldErrors;
    this.zodError = error;
  }

  getFieldErrors() {
    const flattenedErrors: Record<string, string> = {};
    const flatten = (obj: FieldErrors<T>) => {
      for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
          flattenedErrors[key] = value.join('\n');
        } else if (typeof value === 'object') {
          flatten(value as FieldErrors<T>);
        } else {
          flattenedErrors[key] = value as string;
        }
      }
    };
    flatten(this.errors);
    return flattenedErrors;
  }
  // TODO: Analyze whether these come back as objects.

  //   return Object.entries(this.errors).reduce((prev, [key, value]) => {
  //     // prev[key as string] = Array.isArray(value) ? value.join(',') : value,
  //     // return prev;
  //   }, {} as Record<string, string>);
  // }
}

export class PropertyNotFoundException extends CoreException {
  constructor(propertyName: string) {
    super({
      code: 'GENERIC.PROPERTY_NOT_FOUND_EXCEPTION',
      name: 'PropertyNotFoundException',
      message: `The property ${propertyName} was not found.`,
    });
  }
}
