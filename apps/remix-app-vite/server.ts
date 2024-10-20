import { createRequestHandler } from '@remix-run/express';
import express from 'express';
import { createCookieSessionStorage, type ServerBuild } from '@remix-run/node';
import { dispatchWithContext } from './app/.server/shared/config.js';
import { Dispatch } from './app/.server/services/mediator.types';
import shrinkRay from 'shrink-ray-current';
import 'dotenv/config';

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? undefined
    : await import('vite').then((vite) => {
        return vite.createServer({
          server: { middlewareMode: true },
          appType: 'custom',
        });
      });

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          'virtual:remix/server-build'
        ) as Promise<ServerBuild>
    : await import('./build/server/index.js'),
  async getLoadContext(req) {
    const env = process.env as Record<string, string>;
    const sessionFlashSecret = env.SESSION_FLASH_SECRET;

    const flashStorage = createCookieSessionStorage({
      cookie: {
        name: '__flash',
        httpOnly: true,
        maxAge: 60,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionFlashSecret],
        secure: true,
      },
    });

    return {
      cloudflare: {
        env,
      },
      dispatch: (await dispatchWithContext({
        env,
        request: req,
      })) as Dispatch,
      flashStorage,
    };
  },
});

const app = express();

app.use(shrinkRay());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use(
    '/assets',
    express.static('build/client/assets', { immutable: true, maxAge: '1y' })
  );
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }));

// app.use(morgan('tiny'));

// handle SSR requests
app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Express server listening at http://localhost:${port}`)
);
