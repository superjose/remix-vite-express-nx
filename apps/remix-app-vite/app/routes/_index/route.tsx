import {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '../../types/remix';
import { useLoaderData } from '@remix-run/react';
import styles from './../styles.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { dispatch } = context;
  const result = await dispatch({
    type: 'EXAMPLE_COMMAND',
    arg: {},
  });

  const [error, message] = result.intoTuple();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json({ message });

}

export default function Index() {
  const { message } = useLoaderData<typeof loader>();
  return <div>{message}</div>;
}
