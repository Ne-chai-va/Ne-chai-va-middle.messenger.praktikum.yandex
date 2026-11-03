import { Route } from "./Route";
import Block from "./Block";

type BlockConstructor = new (
  props: Record<string, unknown>,
) => Block<Record<string, unknown>>;

export class Router {
  private static __instance: Router | null = null;

  public routes: Route[] = [];
  public history: History = window.history;

  private _currentRoute: Route | null = null;
  private _rootQuery!: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  use(pathname: string, block: BlockConstructor): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      const currentTarget = event.currentTarget as Window;
      this._onRoute(currentTarget.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      // Здесь надо отрендерить страницу 404, если маршрут не найден
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  public getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}

export default new Router("#app");
