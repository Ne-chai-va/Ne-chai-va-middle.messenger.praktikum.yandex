import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../framework/HTTPTransport";

export type ProfileData = Record<
  "first_name" | "second_name" | "display_name" | "login" | "email" | "phone",
  string
>;

export type PasswordData = Record<"oldPassword" | "newPassword", string>;

const userHttp = new HTTPTransport("https://ya-praktikum.tech/api/v2");

export class UserAPI extends BaseAPI {
  override update(data: ProfileData): Promise<unknown> {
    return userHttp.put("/profile", { data });
  }

  updatePassword(data: PasswordData): Promise<unknown> {
    return userHttp.put("/password", { data });
  }
}

export default new UserAPI();
