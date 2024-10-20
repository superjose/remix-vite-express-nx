import { defaults } from 'app/.server/bounded_contexts/core/domain/constants.domain';
  import type { AuthSession, PromiseResult, AppUser } from 'app/.server/bounded_contexts/core/domain/types.domain';
import { RemixAuthNotFoundException } from './exceptions';
import { Err, Ok } from 'oxide.ts';
import { InternalServerException } from 'app/.server/bounded_contexts/core/domain/exceptions.domain';
import { CSRF, CSRFError } from './csrf';
import { createCookie, createCookieSessionStorage } from '../../../types/remix';
import { CsrfTokenException } from './error';
import { UserSchema } from 'app/.server/bounded_contexts/common/domain/schemas.domain';
import type { Request } from 'express';
export type TokenCommit = {
  token: string;
  cookie: string | null;
};

type CreateAuthSessionInput = {
  request: Request;
  authSession: AuthSession;
  user: UserSchema;
  rememberMe?: boolean;
};

export type ConstructorInput = {
  nodeEnv: string;
  sessionSecret: string;
  csrfCookieSessionSecret: string;
  csrfSessionSecret: string;
};

/**
 * Here we handle all the Remix specific handling of the service
 */
export class RemixService {
  #nodeEnv: string;
  #sessionSecret: string;
  #csrf: CSRF;
  constructor(input: ConstructorInput) {
    this.#nodeEnv = input.nodeEnv;
    this.#sessionSecret = input.sessionSecret;

    const cookie = createCookie(defaults.csrfCookieName, {
      path: '/',
      sameSite: 'strict',
      httpOnly: true,
      // These secrets must match
      secrets: [input.csrfCookieSessionSecret],
      secure: this.#nodeEnv === 'production',
    });
    // These secrets must match with the cookie as it compares themselves
    this.#csrf = new CSRF({ cookie, secret: input.csrfCookieSessionSecret });
  }
  #createAuthCookie() {
    return createCookieSessionStorage({
      cookie: {
        name: '__session',
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        secrets: [this.#sessionSecret],
        secure: this.#nodeEnv === 'production',
      },
    });
  }

  async #getSession(request: Request) {
    const cookieHeader = request.headers['cookie'];
    const sessionStorage = this.#createAuthCookie();
    const sessionCookie = await sessionStorage.getSession(cookieHeader);
    return {
      sessionStorage,
      sessionCookie,
    };
  }

  /**
   * This will return the logged in user
   * @param request
   * @returns
   */
  async getAuthSession(
    request: Request
  ): PromiseResult<AppUser, RemixAuthNotFoundException> {
    const { sessionCookie } = await this.#getSession(request);
    const authSession = sessionCookie.get(defaults.sessionKey) as
      | AppUser
      | undefined;

    return authSession
      ? Ok(authSession)
      : Err(new RemixAuthNotFoundException());
  }

  async createAuthSession(
    input: CreateAuthSessionInput
  ): PromiseResult<string, InternalServerException> {
    try {
      const { request, authSession, rememberMe, user } = input;
      const { sessionStorage, sessionCookie } = await this.#getSession(request);

      // allow user session to be null.
      // useful if you want to clear session and display a message explaining why
      if (authSession) {
        sessionCookie.set(defaults.sessionKey, {
          session: authSession,
          ...user,
        });
      }

      const thirtyMins = 1000 * 60 * 30;
      const maxAge = rememberMe ? defaults.sessionMaxAge : thirtyMins;

      return Ok(await sessionStorage.commitSession(sessionCookie, { maxAge }));
    } catch (e) {
      return Err(new InternalServerException(e as Error));
    }
  }

  async destroySessions(
    request: Request
  ): PromiseResult<string, InternalServerException> {
    try {
      const { sessionStorage, sessionCookie } = await this.#getSession(request);
      const setCookie = await sessionStorage.destroySession(sessionCookie);
      return Ok(setCookie);
    } catch (e) {
      return Err(new InternalServerException(e as Error));
    }
  }

  async validateCsrfToken(
    data: FormData,
    headers: Headers
  ): PromiseResult<void, CsrfTokenException | InternalServerException> {
    try {
      await this.#csrf.validate(data, headers);
      return Ok(void 0);
    } catch (e) {
      if (e instanceof CSRFError) {
        return Err(new CsrfTokenException(e));
      }
      return Err(new InternalServerException(e as Error));
    }
  }
  async generateTokenForPage(): PromiseResult<
    TokenCommit,
    CsrfTokenException | InternalServerException
  > {
    try {
      const [token, cookie] = await this.#csrf.commitToken();
      return Ok({ token, cookie });
    } catch (e) {
      return Err(new InternalServerException(e as Error));
    }
  }
}
