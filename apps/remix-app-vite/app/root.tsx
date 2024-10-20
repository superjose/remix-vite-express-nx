import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { i18n, Messages } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import './types/global.d.ts';
import './tailwind.css';
import { useEffect } from 'react';
import {
  HeroScreen,
  BannerProvider,
  CookieBannerProvider,
  AnalyticsProvider,
} from '@alertdown/ui';
import { json, LoaderFunctionArgs } from './types/remix';

// import esMessages from './locales/es'

const localeFiles = import.meta.glob('./locales/**/*.mjs');

/**
 * We load a default placeholder to prevent lingui from complaining
 */

export async function dynamicActivate(locale: string) {
  // Generate the path to the locale file based on the locale string
  const localePath = `./locales/${locale}/messages.mjs`;

  // Check if the locale file exists in the predefined import paths
  if (localeFiles[localePath]) {
    // Dynamically import the locale file
    const module = await localeFiles[localePath]();
    const { messages } = module as { messages: Messages };
    i18n.load(locale, messages);
    i18n.activate(locale);
  } else {
    console.error(`Locale file for ${locale} not found.`);
  }
}

export function Layout({ children }: { children: React.ReactNode }) {
  const error = useRouteError();

  return (
    <html lang="en" data-theme="light">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {isRouteErrorResponse(error) && (
          <title>{`${error.status} ${error.statusText}`}</title>
        )}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const ipCountry = request.headers.get('CF-IPCountry') || 'ES';
  const SEGMENT_APP_KEY = context.cloudflare?.env?.SEGMENT_APP_KEY;
  return json({ ipCountry, SEGMENT_APP_KEY });
}

export default function App() {
  const { ipCountry, SEGMENT_APP_KEY } = useLoaderData<typeof loader>();
  useEffect(() => {
    // With this method we dynamically load the catalogs
    dynamicActivate('en');
  }, []);
  return (
    <I18nProvider i18n={i18n}>
      <BannerProvider>
        <CookieBannerProvider ipCountry={ipCountry}>
          <AnalyticsProvider
            appName="AlertDown"
            segmentKey={SEGMENT_APP_KEY || ''}
          >
            <Outlet />
          </AnalyticsProvider>
        </CookieBannerProvider>
      </BannerProvider>
    </I18nProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <>
      <HeroScreen
        title={"Woops! We couldn't deploy! :/"}
        subtitle={
          isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
              ? error.message
              : 'Unknown Error'
        }
        subtitle2={
          isRouteErrorResponse(error) ? error.data?.__globalError : undefined
        }
        buttonLink="/"
      />
    </>
  );
}
