/**
 * As Remix is very portable. We will define here a single place to reexport
 * the entire remix types.
 *
 * This will guarantee us that we can replace the backend whenever we want
 * and we don't need to affect all the imports in the routes.
 *
 * We will define this on tsconfig.json as a path alias.
 *
 */

export * from '@remix-run/node';
export * from './jsonify';
