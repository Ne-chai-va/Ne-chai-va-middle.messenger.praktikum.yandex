import authAPI, { type LoginData } from "../api/AuthAPI";
import { store, type UserData } from "../framework/Store";
import router from "../framework/Router";

export class AuthController {
  public async login(data: LoginData): Promise<void> {
    try {
      store.setState("auth.error", "");
      store.setState("auth.isLoading", true);

      await authAPI.signin(data);

      const user = await authAPI.request();

      store.setState("auth.user", user as UserData);
      store.setState("auth.isLoading", false);

      router.go("/messenger");
    } catch (error: unknown) {
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

      store.setState("auth.error", errorMessage);
    }
  }

  public async checkAuth(): Promise<boolean> {
    try {
      const user = await authAPI.request();
      store.setState("auth.user", user as UserData);
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthController();
