import userAPI, { type ProfileData, type PasswordData } from "../api/UserAPI";
import { store, type UserData } from "../framework/Store";

export class UserController {
  public async updateAvatar(formData: FormData): Promise<void> {
    try {
      store.setState("user.error", "");
      store.setState("auth.isLoading", true);

      const updatedUser = await userAPI.updateAvatar(formData);
      store.setState("auth.user", updatedUser as UserData);
    } catch (error: unknown) {
      this.handleError(error, "Не удалось обновить аватар");
    } finally {
      store.setState("auth.isLoading", false);
    }
  }

  public async updateProfile(profileData: ProfileData): Promise<void> {
    try {
      store.setState("user.error", "");
      store.setState("auth.isLoading", true);

      const updatedUser = await userAPI.update(profileData);
      store.setState("auth.user", updatedUser as UserData);
    } catch (error: unknown) {
      this.handleError(error, "Не удалось обновить данные профиля");
    } finally {
      store.setState("auth.isLoading", false);
    }
  }

  public async updatePassword(passwordData: PasswordData): Promise<void> {
    try {
      store.setState("user.error", "");
      store.setState("auth.isLoading", true);

      await userAPI.updatePassword(passwordData);
    } catch (error: unknown) {
      this.handleError(error, "Не удалось изменить пароль");
    } finally {
      store.setState("auth.isLoading", false);
    }
  }

  private handleError(error: unknown, fallbackMessage: string): void {
    let errorMessage = fallbackMessage;

    if (error && typeof error === "object" && "response" in error) {
      const xhrError = error as { response: string };
      try {
        const parsed = JSON.parse(xhrError.response) as { reason?: string };
        errorMessage = parsed.reason ?? fallbackMessage;
      } catch {
        errorMessage = xhrError.response;
      }
    }

    store.setState("user.error", errorMessage);
  }
}

export default new UserController();
