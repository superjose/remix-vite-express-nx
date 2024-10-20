import type { LinguiConfig } from '@lingui/conf'
const config: LinguiConfig = {
  locales: ['en', 'es'],
  compileNamespace: 'es',
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}/messages',
      include: ['app'],
    },
  ],
}

export default config
