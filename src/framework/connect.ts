import Block from "./Block";
import { type BlockOwnProps } from "./Block";
import { store, type AppState } from "./Store";
import isEqual from "../utils/isEqual";

type Indexed = Record<string, unknown>;

type BlockConstructor = new (
  props: BlockOwnProps & Indexed,
) => Block<BlockOwnProps>;

export function connect(mapStateToProps: (state: AppState) => Indexed) {
  return function <T extends BlockConstructor>(Component: T): T {
    const factory = function (this: unknown, ...args: unknown[]) {
      const originalProps = (args[0] as Indexed) || {};
      let state = mapStateToProps(store.getState());

      const updatedProps = { ...originalProps, ...state };
      const instance = new (Component as unknown as new (
        props: Indexed,
      ) => Block<BlockOwnProps>)(updatedProps);

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
