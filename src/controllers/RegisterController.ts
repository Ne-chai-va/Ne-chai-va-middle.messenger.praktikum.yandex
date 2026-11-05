import registerAPI, { type RegisterData } from "../api/RegisterAPI";
import authAPI from "../api/AuthAPI";
import { store, type UserData } from "../framework/Store";
import router from "../framework/Router";

export class RegisterController {
  public async register(data: RegisterData): Promise<void> {
    try {
      store.setState("auth.error", "");
      store.setState("auth.isLoading", true);

      await registerAPI.create(data);

      const user = await authAPI.request();

      store.setState("auth.user", user as UserData);
      store.setState("auth.isLoading", false);

      router.go("/messenger");
    } catch (error: unknown) {
      store.setState("auth.isLoading", false);

      let errorMessage = "Ошибка при регистрации";

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
}

export default new RegisterController();
