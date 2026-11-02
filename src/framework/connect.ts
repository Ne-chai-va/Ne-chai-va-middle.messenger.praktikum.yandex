import Block from "./Block";
import { store } from "./Store";
import isEqual from "../utils/isEqual";

type Indexed = Record<string, unknown>;

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function <T extends typeof Block>(Component: T): T {
    const factory = function (this: unknown, ...args: unknown[]) {
      const originalProps = (args[0] as Record<string, unknown>) || {};

      let state = mapStateToProps(store.getState());

      const updatedProps = { ...originalProps, ...state };

      const instance = new (Component as unknown as new (
        props: Record<string, unknown>,
      ) => Block<Record<string, unknown>>)(updatedProps);

      store.subscribe(() => {
        const newState = mapStateToProps(store.getState());

        if (!isEqual(state, newState)) {
          instance.setProps({ ...newState });
        }

        state = newState;
      });

      return instance;
    };

    return factory as unknown as T;
  };
}
