import type { dispatch } from "./mediator";

export type Dispatch = typeof dispatch;
export type ContextDispatch = {
  dispatch: Dispatch;
};
