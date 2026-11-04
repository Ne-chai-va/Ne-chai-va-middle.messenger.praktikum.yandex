import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../framework/HTTPTransport";

export type LoginData = Record<"login" | "password", string>;

const authHttp = new HTTPTransport("https://ya-praktikum.tech");

export class AuthAPI extends BaseAPI {
  override request(): Promise<unknown> {
    return authHttp.get("/user");
  }

  signin(data: LoginData): Promise<unknown> {
    return authHttp.post("/signin", { data });
  }

  logout(): Promise<unknown> {
    return authHttp.post("/logout");
  }
}

export default new AuthAPI();
