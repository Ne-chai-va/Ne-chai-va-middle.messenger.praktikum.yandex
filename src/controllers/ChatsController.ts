import chatsAPI from "../api/ChatsAPI";
import { store, type ChatData, type MessageData } from "../framework/Store";

export class ChatsController {
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

      const list = await chatsAPI.request();
      store.setState("chats.list", list as ChatData[]);
      store.setState("chats.isLoading", false);
    } catch (error: unknown) {
      store.setState("chats.isLoading", false);
      store.setState("chats.error", "Не удалось создать чат");
      console.error("Ошибка при создании чата:", error);
    }
  }

  public selectChat(chatId: number): void {
    store.setState("chats.activeChatId", chatId);

    const mockHistory: MessageData[] = [
      {
        id: 1,
        user_id: 111,
        chat_id: chatId,
        type: "message",
        time: "18:20",
        content: "Подскажи, как лучше всего сверстать контейнер?",
        is_read: true,
      },
      {
        id: 2,
        user_id: 222,
        chat_id: chatId,
        type: "message",
        time: "18:22",
        content: "Здравствуй! Теперь я знаю, как сделать это лучше!",
        is_read: true,
      },
    ];
    store.setState("chats.messages", mockHistory);
  }

  public sendMessage(text: string): void {
    const state = store.getState();
    const activeChatId = state.chats?.activeChatId;
    if (!activeChatId) return;

    const currentMessages = state.chats?.messages ?? [];

    const newMessage: MessageData = {
      id: Date.now(),
      user_id: 111,
      chat_id: activeChatId,
      type: "message",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content: text,
      is_read: false,
    };

    store.setState("chats.messages", [...currentMessages, newMessage]);
  }
}

export default new ChatsController();
