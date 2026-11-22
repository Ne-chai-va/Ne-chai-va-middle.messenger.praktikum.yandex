import chatsAPI from "../api/ChatsAPI";
import { store, type ChatData, type MessageData } from "../framework/Store";
import { WSTransport, WSTransportEvents } from "../framework/WSTransport";

export class ChatsController {
  private wsTransport: WSTransport | null = null;

  public async fetchChats(): Promise<void> {
    try {
      store.setState("chats.isLoading", true);
      const list = await chatsAPI.request();
      store.setState("chats.list", list as ChatData[]);
      store.setState("chats.isLoading", false);
    } catch {
      store.setState("chats.isLoading", false);
      store.setState("chats.error", "Не удалось загрузить чаты");
    }
  }

  public async createChat(title: string): Promise<void> {
    try {
      store.setState("chats.isLoading", true);
      await chatsAPI.create(title);
      await this.fetchChats();
    } catch (error: unknown) {
      store.setState("chats.isLoading", false);
      store.setState("chats.error", "Не удалось создать чат");
      console.error("Ошибка при создании чата:", error);
    }
  }

  public async deleteChat(chatId: number): Promise<void> {
    try {
      store.setState("chats.isLoading", true);
      await chatsAPI.delete(chatId);

      const currentState = store.getState();
      if (currentState.chats?.activeChatId === chatId) {
        store.setState("chats.activeChatId", null);
        store.setState("chats.messages", []);
      }

      await this.fetchChats();
    } catch (error: unknown) {
      store.setState("chats.isLoading", false);
      store.setState("chats.error", "Не удалось удалить чат");
      console.error("Ошибка при удалении чата:", error);
    }
  }

  public async addUserToChat(chatId: number, userId: number): Promise<void> {
    try {
      store.setState("chats.isLoading", true);
      await chatsAPI.addUsers(chatId, [userId]);
      store.setState("chats.isLoading", false);
      alert("Пользователь успешно добавлен в чат!");
    } catch (error: unknown) {
      store.setState("chats.isLoading", false);
      console.error("Ошибка при добавлении пользователя:", error);
    }
  }

  public async removeUserFromChat(
    chatId: number,
    userId: number,
  ): Promise<void> {
    try {
      store.setState("chats.isLoading", true);
      await chatsAPI.deleteUsers(chatId, [userId]);
      store.setState("chats.isLoading", false);
      alert("Пользователь удалён из чата!");
    } catch (error: unknown) {
      store.setState("chats.isLoading", false);
      console.error("Ошибка при удалении пользователя:", error);
    }
  }

  public async selectChat(chatId: number): Promise<void> {
    const state = store.getState();
    if (state.chats?.activeChatId === chatId && this.wsTransport) {
      return;
    }

    if (this.wsTransport) {
      this.wsTransport.close();
      this.wsTransport = null;
    }

    store.setState("chats.activeChatId", chatId);
    store.setState("chats.messages", []);

    const userId = store.getState().auth?.user?.id;
    if (!userId) {
      console.error("Пользователь не авторизован");
      return;
    }

    try {
      const { token } = await chatsAPI.getChatToken(chatId);

      if (store.getState().chats?.activeChatId !== chatId) {
        return;
      }

      const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
      const transport = new WSTransport(wsUrl);
      this.wsTransport = transport;

      transport.on(WSTransportEvents.Message, (data: unknown) => {
        this.handleIncomingMessages(data);
      });

      await this.wsTransport.connect();

      if (this.wsTransport !== transport) {
        transport.close();
        return;
      }

      transport.send({
        content: "0",
        type: "get old",
      });
    } catch (error) {
      console.error("Ошибка при подключении к WebSocket:", error);
    }
  }

  private handleIncomingMessages(data: unknown): void {
    const currentMessages = store.getState().chats?.messages ?? [];

    if (Array.isArray(data)) {
      const sortedHistory = (data as MessageData[]).reverse();
      store.setState("chats.messages", [...sortedHistory, ...currentMessages]);
    } else if (
      data &&
      typeof data === "object" &&
      "type" in data &&
      data.type === "message"
    ) {
      store.setState("chats.messages", [
        ...currentMessages,
        data as MessageData,
      ]);
      this.fetchChats();
    }
  }

  public sendMessage(text: string): void {
    if (!this.wsTransport) {
      console.error("Нет активного WebSocket соединения");
      return;
    }

    this.wsTransport.send({
      content: text,
      type: "message",
    });
  }
}

export default new ChatsController();
