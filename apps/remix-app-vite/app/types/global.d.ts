import { Dispatch } from '../.server/services/mediator.types';
import { SessionData, SessionStorage } from './remix';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SEGMENT_APP_KEY: string;
      SESSION_FLASH_SECRET: string;
    }
  }
}

declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    // cloudflare: Cloudflare;
    dispatch: Dispatch;
    flashStorage: SessionStorage<SessionData, SessionData>;
  }
}
declare module '@remix-run/node' {
  interface AppLoadContext {
    dispatch: Dispatch;
    flashStorage: SessionStorage<SessionData, SessionData>;
  }
}
interface Env {
  SEGMENT_APP_KEY: string;
  SESSION_FLASH_SECRET: string;
}

// export type Cloudflare = Omit<PlatformProxy<Env>, 'dispose'>;

declare module '*.svg' {
  const content: any;
}
declare module '*.avif' {
  const content: any;
}

declare module '*.css?url' {
  const content: any;
}
