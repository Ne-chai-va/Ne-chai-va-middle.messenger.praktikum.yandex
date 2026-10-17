import Block from "../framework/Block";
import { ChatItem } from "../components/ChatItem/ChatItem";
import { ChatScreen } from "../components/ChatScreen/ChatScreen";
import { chats } from "../mock-data";

export class Chat extends Block {
  static componentName = "Chat";

  constructor() {
    super({});
  }

  protected componentDidMount() {
    const listContainer = this.refs.chatsList;
    if (listContainer) {
      chats.forEach((chatData) => {
        const chatItem = new ChatItem(chatData);
        const chatItemElement = chatItem.element();

        if (chatItemElement) {
          const li = document.createElement("li");
          li.className = "chats-controls__chats-item";
          li.append(chatItemElement);
          listContainer.append(li);
        }
      });
    }

    const viewContainer = this.refs.chatView;
    if (viewContainer && chats.length > 0) {
      const activeChatData = chats[0];

      const chatScreen = new ChatScreen({
        title: activeChatData.title,
        avatarUrl: activeChatData.avatarUrl,
      });

      const screenElement = chatScreen.element();
      if (screenElement) {
        viewContainer.append(screenElement);
      }
    }
  }

  protected template = `
    <div class="chats-container">
      <aside class="chats-controls">
        {{Button text="Профиль >" className="chats-controls__button"}}
        <search class="chats-search">
          <form class="chats-search__form">
            {{Input type="search" placeholder="Поиск" className="chats-search__input"}}
          </form>
        </search>
        <ul ref="chatsList" class="chats-controls__chats-list backdrop">
        </ul>
      </aside>
    
      <main ref="chatView" class="chat-view">
      </main>
    </div>
  `;
}
