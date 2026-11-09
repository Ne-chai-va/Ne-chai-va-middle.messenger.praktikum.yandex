import { BaseAPI } from "./BaseAPI";
import { HTTPTransport } from "../framework/HTTPTransport";

const chatsHttp = new HTTPTransport("https://ya-praktikum.tech/api/v2");

export class ChatsAPI extends BaseAPI {
  override request(): Promise<unknown> {
    return chatsHttp.get("/chats");
  }

  override create(title: string): Promise<unknown> {
    return chatsHttp.post("/chats", { data: { title } });
  }

  override delete(chatId: number): Promise<unknown> {
    return chatsHttp.delete("/chats", { data: { chatId } });
  }

  addUsers(chatId: number, users: number[]): Promise<unknown> {
    return chatsHttp.put("/chats/users", { data: { users, chatId } });
  }

  deleteUsers(chatId: number, users: number[]): Promise<unknown> {
    return chatsHttp.delete("/chats/users", { data: { users, chatId } });
  }
}

export default new ChatsAPI();
