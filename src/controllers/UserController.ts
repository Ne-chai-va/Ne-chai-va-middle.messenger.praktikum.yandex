import userAPI, { type ProfileData, type PasswordData } from "../api/UserAPI";
import { store, type UserData } from "../framework/Store";

export class UserController {
  public async updateProfile(
    profileData: ProfileData,
    passwordData: PasswordData | null,
  ): Promise<void> {
    try {
      store.setState("auth.error", "");
      store.setState("auth.isLoading", true);

      if (passwordData) {
        await userAPI.updatePassword(passwordData);
      }

      const updatedUser = await userAPI.update(profileData);

      store.setState("auth.user", updatedUser as UserData);
      store.setState("auth.isLoading", false);
      alert("Данные успешно сохранены!");
    } catch (error: unknown) {
      store.setState("auth.isLoading", false);

      let errorMessage = "Ошибка при сохранении данных";
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

export default new UserController();
