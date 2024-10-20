import { WithAppContext } from 'app/.server/services/app.context'
import { Ok } from 'oxide.ts'

export type ExampleCommand = {
  message: string;
  message: string;
}

export async function ExampleCommandHandler(
  cmd: WithAppContext<ExampleCommand>
) {
  return Ok(cmd.message);
}
