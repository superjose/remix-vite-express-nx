// For future references:
// https://stackoverflow.com/questions/73858593/typescript-type-for-a-dispatcher-in-a-dictionary
// https://www.typescriptlang.org/play?ts=4.8.2#code/C4TwDgpgBAwgThAhsCBVAzhOMD2BbPRAOwBMoBeKAbwCgooJCBLAGwC4p1g4miBzANx0oYROnQB3HHBIcuPfkIC+QmmJBEAxlABmAVy3AmOIrATI0mbPkKkAEsRIssACk15ZZpCgxZcBRwBKamFNE3QcZwA6Fhw+FwAieG9ePihfOATAoXoEYD04U249CGUaGlBIKABxCGAM9ABFErgQCmoVcvUtXQNNIxMauobmrBAHUmc4FwBHDlr6qyaWkGDaXLqC03X6KD0ljgBtYV2Q09OmTwTLgFoARgSAGhPzokQ8CA4EgCk9FiZiFAAApYCAALwSL3oSme5zOcKgly+twATE8obs3h8vgBBEjvKAAZTwTGAAAtIXClC8ALrCTrUmhhIhcKAAfTCAVI6AA8nBRjwIOh2jsYAAlACiOIAKhK2ahCRKxRxkhYMv5bCQJk4sLCahLpfLFWLCWzGqglQBNebDJYC8aOKY0ToVcDQDWOXn8lpMIXtSoQHA6dmczVegW+9BCANQACSRDAemAAFlEGARVBDgBpRGmADWEBAQdgNk9fIjQppHCBiDg7zqWHQAB4Pdzyz6hdmaQA+Q4ABhpUE6MZ5ScTKbTGezuagBaLwdbJHDHfQVagYs2hWlbpbpbb3qwka73aHTPCwCgobLB8F6A4VEzOd4s8LxcXy8PlY4LlrfA48fHVMwC7YJyBPUdgEAtMuyHdoOT3Jd20-KNXSqZMIBIAFgGkJscwgAAPFBuRfecSy5RCb0jdo5zfBCP1vE9KAfQ4gRnLM1wfANq0eKBf3-BMkyAljByUIcu3KGNk3adDMOQaQhAAegAKigSSRReLioCSSUZTlBUlQSHJdj4rw1SsRdlCgAAfeF6E0hJqgNI0lVNc0rUMl4TIWEYVkspSFPKZlWUw9BRGATQyXaXCGEIiBiJohc6KQhiXE4t0eN-IcOBkrCcKzbtQO7UIksozsAxpH84D4QJyjUdANG0fRDGMIohWAFw1nKeggovBB0D+C9KEQCREFJKAQrCiLUo0t0vnFKVZWcsV0VOEydlORhRvYLTyQgTbWAAAWYFgok5FbzlEcQpBkL5dpEMRJGkEhKV2aloWyLqoAUhSoD6gaUU4MkcD+MgACNoAffZG3vLFPk4bhUgERFPHkVIxLpbrz1+oV-vaYbRovCbkCm9bVNmrTHMNfSTTNC0xUtc76DWt6hw+50gA
// https://www.typescriptlang.org/play?#code/KYDwDg9gTgLgBDAnmYcDCVgEMbAKoDOwUaEAtmVgHYAmcAvHAN4CwAUHHMJQJYA2ALjgEYUHlQDmAbnacwWAgQDu0GkJFjJMtgF9t7UJFhwFiKgGM4AMwCuFmDwhV0mHPiIlylWgAlqNPmIACnMyNRdsXEJiUgp-AEpmWThzJwIIQIA6PggJIIAiDEjxCThoqHz47U5MGBsoZ1EbYG0ddgNwaHgkFDgAcWAYcoIARWaoRAZmPXa2Qy6TAjNLW3tHZwGhj1HxxD9aQKgggEchTeGx4kRE1g44WvrnW85OG22hAG1kl6S7n84eOF8oCALQARnyABpvv8qFgyMAhPkAFI2Pg8ahwAAKxGAAC98jDODpoX8Xs9-gCgaCAExQokvOEIpEAQRo8LgAGUyDwYAALQlk4kwgC6yRmulmqSoIhSXn8BAA8lBLmJgAQphS0AAlACiLIAKrqAPp4Tm67VCIpucqxbw0fYBYikzh9XUG03m7Wc40jPAWgCaZ0GF12jsO7Al7B6qAAssAaBiYNAGMkAD6-SkxpE6-VGz0W-LVf5YKASIQxiBWCI2jx2-zh4hwDPWqJ1+W0YvCu4Zik-bNwfJuj1mi0+v2BosM0vlhDIYBV-oh7aqvb+Q7NpdbYg7K5duBRuadYyrcwOJxwRMEeQwcx8gA8Bq4IFwtA18cTOGgH3yMfyIoAPiCJgTDLSE516HQhF1F8oCwM97w-JNoHAkCByfHQAPiIRtUGR4DXne9K2rVI4jfZVVR4dUPgNQDM3uPCGjlMiaCVFVxioggPhjEUghnRYTCoa4BNwuoGgIlAiPnRcrxvO9HwAgDWlmdg+KWCw4CCRJ6AA+iAHo9LgXCCDReACD5CA0ToAAjVBrIgDJsCoZJpVlTATL4eBGCwJQsF5S8eGvHA72AmEB0KPVDRNUdtXpMkZyEPsXm4PzBEHflgBS-gAAFeD4TJSLiyl5EUFQoCBDK4BK5RVEFH42juHQqlmTgDIYjyYBpYQLKsuBbOYOA3h3RKmURYRRBKKQ4EBdQJskA8PjFO5XPgdzTK67zfP82Tgr5UKyXC4cC29X1-W1AMipeBLpnFZrdHiLTtCAA

import { Err, Result } from 'oxide.ts';
import { register } from './register';
import {
  CoreException,
  IException,
  InternalServerException,
  isErrorOf,
  ValidationException,
} from '../bounded_contexts/core/domain/exceptions.domain';
import { AppContext } from './app.context';

/**
 * We implement the mediator pattern by having an object handle both keys
 * and functions.
 *
 * Note, that you may like to create 2 objects. One for commands,
 * and the other for queries, as one of the purpose of this approach is
 * to optimize each action (Reads are 10x more frequent than writes and can
 * leverage a cache).
 *
 * The beauty of this, is that you can perform optimizations to the code in a central
 * place, and your actual business logic won't be affected.
 */

const _commandsOrQueries = register;

type CommandsOrQueries = typeof _commandsOrQueries;

/**
 * We want to augment every argument passed with some optional props
 */
type CommonArgs = {
  /**
   * These are the exceptions that we won't report as errors
   */
  whitelistedExceptions?: IException[];
};

type InputMap = {
  [K in keyof CommandsOrQueries]: Omit<
    Parameters<CommandsOrQueries[K]>[0],
    'ctx'
  >;
};
type OutputMap = {
  [K in keyof CommandsOrQueries]: ReturnType<CommandsOrQueries[K]>;
};
const commandsOrQueries: {
  [K in keyof CommandsOrQueries]: (arg: InputMap[K]) => OutputMap[K];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} = _commandsOrQueries as any;
type Mediator<K extends keyof CommandsOrQueries> = {
  [P in K]: { type: P; arg: InputMap[P] & CommonArgs };
}[K];

/**
 *
 * We then dispatch the function that we have stored by calling its key value.
 * This will create a separation of the code, slim your controllers, and reduce
 * dependencies.
 *
 * You could work out additional logic to make this dispatch pluggable.
 * For example, the logTime function down below works as a universal logger.
 * It will log all the commands and print out the time it started to execute.
 *
 * If you have a better typing definition, that'd be sick!
 * @param param0
 * @returns
 */
export const dispatch = async <K extends keyof CommandsOrQueries>({
  type,
  arg,
}: Mediator<K>) => {
  if (!(type in commandsOrQueries)) {
    console.error(`${type} was not found in CQ`);
  }

  const result = await commandsOrQueries[type](arg);

  // We try to detect if it's an oxide.ts result
  if (!('intoTuple' in result)) {
    return result;
  }

  // We want to log every error that gets thrown from the dispatcher
  const r = result as Result<unknown, CoreException>;
  const [err] = r.intoTuple();

  if (isErrorOf(err, ValidationException)) {
    console.error(`Error while executing - ${type}`, {
      ...JSON.parse(
        JSON.stringify((err as ValidationException<unknown>).getFieldErrors())
      ),
    });
  } else if (err) {
    console.error(`Error while executing - ${type}`, {
      ...JSON.parse(JSON.stringify(err)),
    });
  }
  return result;
};

export async function dispatchWithExtraParams<
  K extends keyof CommandsOrQueries,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
>(
  { type, arg }: Mediator<K>,
  ctx: AppContext,
) {
  const logger = ctx.services.log;
  if (!(type in commandsOrQueries)) {
    await logger.error({
      payload: {
        error: {
          name: 'TypeNotFoundException',
          code: 'CQRS.TYPE_NOT_FOUND',
          message: `${type} was not found in CQ`,
        },
      },
      type,
    });
    throw new Error(`${type} was not found in CQ`);
  }
  const begin = performance.now();
  try {
    const result = await commandsOrQueries[type]({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(arg as any),
      ctx: {
        ...ctx,
        __meta: {
          cqrsType: type,
        },
      },
    });
    const end = performance.now();
    const duration = end - begin;

    // We try to detect if it's an oxide.ts result
    if (!('intoTuple' in result)) {
      await logger.info({ duration, type });
      return result;
    }

    // We want to log every error that gets thrown from the dispatcher
    const r = result as Result<unknown, CoreException>;
    const [err] = r.intoTuple();
    const hasWhiteListedException = arg.whitelistedExceptions?.find((excep) => {
      return isErrorOf(err, excep);
    });
    if (hasWhiteListedException) {
      await logger.info({
        duration,
        type,
        payload: {
          error: err?.toLog(),
          expectedException: true,
        },
      });
      return result;
    }

    if (isErrorOf(err, ValidationException)) {
      await logger.error({
        duration,
        type,
        ...JSON.parse(
          JSON.stringify((err as ValidationException<unknown>).getFieldErrors())
        ),
      });
    } else if (err) {
      await logger.error({
        payload: {
          error: err.toLog(),
        },
        type,
        duration,
      });
    } else {
      logger.info({
        duration,
        type,
      });
    }
    return result;
  } catch (e: unknown) {
    const end = performance.now();
    const duration = end - begin;
    await logger.error({
      payload: {
        error: e,
      },
      type,
      duration,
    });
    return Err(new InternalServerException(e as Error));
  }
}
