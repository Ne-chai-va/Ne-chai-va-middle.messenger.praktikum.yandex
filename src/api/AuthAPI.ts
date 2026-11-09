import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../framework/HTTPTransport";

export type LoginData = Record<"login" | "password", string>;

const authHttp = new HTTPTransport("https://ya-praktikum.tech/api/v2");

export class AuthAPI extends BaseAPI {
  override request(): Promise<unknown> {
    return authHttp.get("/auth/user");
  }

  signin(data: LoginData): Promise<unknown> {
    return authHttp.post("/auth/signin", { data });
  }

  logout(): Promise<unknown> {
    return authHttp.post("/auth/logout");
  }
}

export default new AuthAPI();
