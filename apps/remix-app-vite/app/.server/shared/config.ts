import type { dispatch } from '../services/mediator';
import { dispatchWithExtraParams } from '../services/mediator';
import {
  AppContext,
  AppDomainEvent,
  getAppContext,
  type GenerateContextInput,
} from '../services/app.context';
import { EventBus } from '@alertdown/core';

/**
 * This will be a wrapper function that will include
 * the parameters for the context
 * @param args
 */
export function dispatchWithContext(input: GenerateContextInput) {
  return async (args: Parameters<typeof dispatch>[0]) => {
    const context = await getAppContext(input);
    const eventBus = new EventBus<AppDomainEvent, AppContext>(context.ctx);
    return dispatchWithExtraParams(args, context.ctx, eventBus);
  };
}
