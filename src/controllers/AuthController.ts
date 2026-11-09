import authAPI, { type LoginData } from "../api/AuthAPI";
import { store, type UserData } from "../framework/Store";
import router from "../framework/Router";

export class AuthController {
  public async login(data: LoginData): Promise<void> {
    try {
      store.setState("auth.loginError", "");
      store.setState("auth.isLoading", true);

      await authAPI.signin(data);

      const user = await authAPI.request();

      store.setState("auth.user", user as UserData);
      store.setState("auth.isLoading", false);

      router.go("/messenger");
    } catch (error: unknown) {
      console.log(error);
      store.setState("auth.isLoading", false);

      let errorMessage = "Неизвестная ошибка";

      if (error && typeof error === "object" && "response" in error) {
        const xhrError = error as { response: string };
        try {
          const parsed = JSON.parse(xhrError.response) as { reason?: string };
          errorMessage = parsed.reason ?? errorMessage;
        } catch {
          errorMessage = xhrError.response;
        }
      }

      store.setState("auth.loginError", errorMessage);
    }
  }

  public async checkAuth(): Promise<boolean> {
    try {
      const state = store.getState();
      if (state.auth?.user) {
        return true;
      }

      const user = await authAPI.request();
      store.setState("auth.user", user as UserData);
      return true;
    } catch {
      store.setState("auth.user", null);
      return false;
    }
  }

  public async logout(): Promise<void> {
    try {
      await authAPI.logout();

      store.setState("auth.user", null);
      store.setState("auth.error", "");
      store.setState("chats.list", []);
      store.setState("chats.messages", []);
      store.setState("chats.activeChatId", null);

      router.go("/");
    } catch (error: unknown) {
      console.error("Ошибка при выходе из системы:", error);
    }
  }
}

export default new AuthController();
