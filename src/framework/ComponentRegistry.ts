import Handlebars from "handlebars";
import type { HelperOptions } from "handlebars";
import Block from "./Block";
import type { BlockOwnProps } from "./Block";

type BlockConstructor = {
  new (...args: never[]): Block<BlockOwnProps>;
  componentName: string;
};

let uniqueId = 0;

function registerComponent(Component: unknown) {
  const comp = Component as BlockConstructor;
  const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;

  Handlebars.registerHelper(
    comp.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const ComponentClass = Component as new (
        props: Record<string, unknown>,
      ) => Block<BlockOwnProps>;
      const component = new ComponentClass(hash);

      if ("ref" in hash) {
        (data.root.__refs = data.root.__refs || {})[hash.ref] =
          component.element();
      }

      (data.root.__children = data.root.__children || []).push({
        component,
        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);
          if (!placeholder) {
            throw new Error(
              `Can't find data-id for component ${comp.componentName}`,
            );
          }

          const element = component.element();
          if (!element) {
            throw new Error("Component element is not created");
          }

          placeholder.replaceWith(element);
        },
      });

      return new Handlebars.SafeString(`<div ${dataAttribute}></div>`);
    },
  );
}

export { registerComponent };
