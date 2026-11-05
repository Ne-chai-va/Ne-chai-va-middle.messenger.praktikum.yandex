import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../framework/HTTPTransport";

export type RegisterData = Record<
  "first_name" | "second_name" | "email" | "phone" | "login" | "password",
  string
>;

const registerHttp = new HTTPTransport("https://ya-praktikum.tech");

export class RegisterAPI extends BaseAPI {
  override create(data: RegisterData): Promise<unknown> {
    return registerHttp.post("/signup", { data });
  }
}

export default new RegisterAPI();
