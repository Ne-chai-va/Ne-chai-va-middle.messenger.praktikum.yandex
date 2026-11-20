import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockWindow, renderMock, leaveMock } = vi.hoisted(() => {
  const win = {
    location: { pathname: "/" },
    history: {
      pushState: vi.fn((_state: unknown, _title: string, url: string) => {
        win.location.pathname = url;
      }),
      back: vi.fn(),
      forward: vi.fn(),
    },
    onpopstate: null as ((event: any) => void) | null,
    dispatchEvent: vi.fn((event: { type: string }) => {
      if (event.type === "popstate" && win.onpopstate) {
        win.onpopstate({ currentTarget: win });
      }
    }),
  };
  vi.stubGlobal("window", win);

  return {
    mockWindow: win,
    renderMock: vi.fn(),
    leaveMock: vi.fn(),
  };
});

import { Router } from "./Router";
import AuthController from "../controllers/AuthController";

vi.mock("../controllers/AuthController", () => ({
  default: {
    checkAuth: vi.fn(),
  },
}));

vi.mock("./Route", () => {
  return {
    Route: class MockRoute {
      pathname: string;

      constructor(pathname: string) {
        this.pathname = pathname;
      }

      match(path: string) {
        return path === this.pathname;
      }

      render = renderMock;
      leave = leaveMock;
    },
  };
});

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("Router", () => {
  let router: Router;
  const MockBlock = class {} as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockWindow.location.pathname = "/";
    mockWindow.onpopstate = null;

    (Router as any).__instance = null;
    router = new Router("#app");

    router
      .use("/", MockBlock)
      .use("/sign-up", MockBlock)
      .use("/messenger", MockBlock)
      .use("/settings", MockBlock)
      .use("*", MockBlock);

    vi.mocked(AuthController.checkAuth).mockResolvedValue(false);
  });

  describe("Route registration and matching", () => {
    it("should act as a Singleton and return the same instance", () => {
      const router2 = new Router("#other-root");
      expect(router).toBe(router2);
    });

    it("should return an exact route when the pathname matches", () => {
      const route = router.getRoute("/settings");
      expect(route).toBeDefined();
      expect((route as any).pathname).toBe("/settings");
    });

    it("should fall back to the wildcard '*' route when no exact route is found", () => {
      const route = router.getRoute("/unknown-page-404");
      expect(route).toBeDefined();
      expect((route as any).pathname).toBe("*");
    });
  });

  describe("Navigation and History API", () => {
    it("should update URL via pushState and render the page when calling go()", async () => {
      router.go("/sign-up");
      await flushPromises();

      expect(mockWindow.history.pushState).toHaveBeenCalledWith(
        {},
        "",
        "/sign-up",
      );
      expect(renderMock).toHaveBeenCalledTimes(1);
    });

    it("should call history.back() and history.forward()", () => {
      router.back();
      expect(mockWindow.history.back).toHaveBeenCalledTimes(1);

      router.forward();
      expect(mockWindow.history.forward).toHaveBeenCalledTimes(1);
    });

    it("should handle the popstate event (browser Back/Forward buttons)", async () => {
      mockWindow.location.pathname = "/sign-up";
      await router.start();

      renderMock.mockClear();

      mockWindow.location.pathname = "/";
      mockWindow.dispatchEvent({ type: "popstate" });
      await flushPromises();

      expect(renderMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("Route lifecycle", () => {
    it("should call leave() on the previous route when navigating to a new one", async () => {
      router.go("/");
      await flushPromises();
      expect(renderMock).toHaveBeenCalledTimes(1);
      expect(leaveMock).not.toHaveBeenCalled();

      router.go("/sign-up");
      await flushPromises();

      expect(leaveMock).toHaveBeenCalledTimes(1);
      expect(renderMock).toHaveBeenCalledTimes(2);
    });

    it("should NOT call leave() when navigating to the currently active route", async () => {
      router.go("/");
      await flushPromises();

      router.go("/");
      await flushPromises();

      expect(leaveMock).not.toHaveBeenCalled();
    });
  });

  describe("Route protection and redirects (Authorization)", () => {
    it("should redirect an unauthenticated user from a private route to '/'", async () => {
      vi.mocked(AuthController.checkAuth).mockResolvedValue(false);

      router.go("/messenger");
      await flushPromises();

      expect(mockWindow.history.pushState).toHaveBeenLastCalledWith(
        {},
        "",
        "/",
      );
      expect(renderMock).toHaveBeenCalledTimes(1);
    });

    it("should redirect an authenticated user from a public route to '/messenger'", async () => {
      vi.mocked(AuthController.checkAuth).mockResolvedValue(true);

      router.go("/sign-up");
      await flushPromises();

      expect(mockWindow.history.pushState).toHaveBeenLastCalledWith(
        {},
        "",
        "/messenger",
      );
      expect(renderMock).toHaveBeenCalledTimes(1);
    });
  });
});
