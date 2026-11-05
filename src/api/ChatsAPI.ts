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

  getChatToken(chatId: number): Promise<unknown> {
    return chatsHttp.post(`/token/${chatId}`);
  }
}

export default new ChatsAPI();
