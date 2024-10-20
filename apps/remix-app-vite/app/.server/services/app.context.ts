import { RemixService } from './remix';
import type { Request } from 'express';
import { User } from '../bounded_contexts/user/domain/user.domain';

type AppBaseContext = {
  app: {
    remix: RemixService;
  };
};

export type AppContext = AppBaseContext;

export type WithAppContext<T> = WithContext<T, AppBaseContext>;

export type GenerateContextInput = {
  /**
   * Unfortunately Cloudflare Workers does not expose the
   * process.env environment variables.
   * We had to refactor the application to inject them instead
   */
  env: Record<string, string>;
  request: Request;
};

/**
 * This will be a somewhat Inversion of Control container
 * that will hold all the shared services across the app.
 *
 * These will be passed to the dispatch function so each command
 * or query can use the shared services or the repository.
 *
 * @param input Receives all the configuration, especially
 *              from the request in order for it to be
 *              instantiated successfully
 * @returns
 */

export async function getAppContext(
  input: GenerateContextInput
): Promise<{ ctx: AppContext }> {
  const remix = new RemixService({
    nodeEnv: envs.NODE_ENV,
    sessionSecret: envs.SESSION_SECRET,
    csrfCookieSessionSecret: envs.CSRF_COOKIE_SESSION_SECRET,
    csrfSessionSecret: envs.CSRF_SESSION_SECRET,
  });
  const userResult = await remix.getAuthSession(input.request);

  const [, remixUser] = userResult.intoTuple();

  const user = remixUser
    ? User.createAppUser(remixUser)
    : User.createAnonymousUser();

  const db = getDrizzleClient({
    databaseUrl: envs.DATABASE_URL,
    env: envs.NODE_ENV,
    mode: envs.MODE,
  });


  return {
    ctx: {
      app: {
        remix,
      },
    },
  };
}
