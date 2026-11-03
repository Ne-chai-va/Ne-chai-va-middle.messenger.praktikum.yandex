import Block from "./Block";

type BlockConstructor = new (props: any) => Block<any>;

interface RouteProps {
  rootQuery: string;
  [key: string]: unknown;
}

export class Route {
  private _pathname: string;
  private _blockClass: BlockConstructor;
  private _block: Block<any> | null = null;
  private _props: RouteProps;

  constructor(pathname: string, view: BlockConstructor, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
  }

  leave(): void {
    if (this._block) {
      const el = this._block.element();
      if (el) {
        el.remove();
      }
    }
  }

  match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  render(): void {
    const root = document.querySelector(this._props.rootQuery);
    if (!root) {
      throw new Error(
        `Root element with query "${this._props.rootQuery}" not found`,
      );
    }

    if (!this._block) {
      this._block = new this._blockClass(this._props);
      const el = this._block.element();
      if (el) {
        root.appendChild(el);
      }
      return;
    }

    const el = this._block.element();
    if (el) {
      root.appendChild(el);
    }
  }
}
