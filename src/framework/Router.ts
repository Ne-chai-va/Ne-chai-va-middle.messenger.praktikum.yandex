import { Route } from "./Route";
import Block from "./Block";
import { type BlockOwnProps } from "./Block";
import AuthController from "../controllers/AuthController";

type BlockConstructor = new (
  props: BlockOwnProps & Record<string, unknown>,
) => Block<BlockOwnProps>;

export class Router {
  private static __instance: Router | null = null;

  public routes: Route[] = [];
  public history: History = window.history;

  private _currentRoute: Route | null = null;
  private _rootQuery: string;

  private _privateRoutes = ["/messenger", "/settings"];
  private _publicRoutes = ["/", "/sign-up"];

  constructor(rootQuery: string) {
    this._rootQuery = rootQuery;

    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;
  }

  use(pathname: string, block: BlockConstructor): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  async start(): Promise<void> {
    window.onpopstate = async (event: PopStateEvent) => {
      const currentTarget = event.currentTarget as Window;
      await this._onRoute(currentTarget.location.pathname);
    };

    await this._onRoute(window.location.pathname);
  }

  private async _onRoute(pathname: string): Promise<void> {
    const isAuthed = await AuthController.checkAuth();

    if (isAuthed && this._publicRoutes.includes(pathname)) {
      this.go("/messenger");
      return;
    }

    if (!isAuthed && this._privateRoutes.includes(pathname)) {
      this.go("/");
      return;
    }

    const route = this.getRoute(pathname);

    if (!route) {
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
    const exactRoute = this.routes.find(
      (route) => route.match(pathname) && !route.match("*"),
    );
    if (exactRoute) {
      return exactRoute;
    }
    return this.routes.find((route) => route.match("*"));
  }
}

export default new Router("#app");
