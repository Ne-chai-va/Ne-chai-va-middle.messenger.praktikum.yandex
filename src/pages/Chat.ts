import Block from "../framework/Block";
import { type BlockOwnProps } from "../framework/Block";
import { ChatItem } from "../components/ChatItem/ChatItem";
import { ChatScreen } from "../components/ChatScreen/ChatScreen";
import { MessageBubble } from "../components/MessageBubble/MessageBubble";
import { Input } from "../components/Input/Input";
import chatsController from "../controllers/ChatsController";
import { connect } from "../framework/connect";
import {
  type AppState,
  type ChatData,
  type MessageData,
} from "../framework/Store";
import router from "../framework/Router";

interface ChatPageProps extends BlockOwnProps {
  chatsList: ChatData[];
  messages: MessageData[];
  activeChatId: number | null;
}

class ChatPageBase extends Block<ChatPageProps> {
  static componentName = "Chat";

  constructor(
    props: ChatPageProps = { chatsList: [], messages: [], activeChatId: null },
  ) {
    super(props);

    this.events = {
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.textContent?.includes("Профиль")) {
          e.preventDefault();
          router.go("/settings");
        }
      },
      submit: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("chats-create__form")) {
          e.preventDefault();
          this.handleCreateChatSubmit();
        }
      },
    };

    chatsController.fetchChats();
  }

  private handleCreateChatSubmit() {
    let isFieldValid = true;
    let chatTitle = "";

    this.children.forEach((child) => {
      if (child instanceof Input && child.name === "newChatTitle") {
        isFieldValid = child.validate();
        chatTitle = child.getValue();
      }
    });

    if (isFieldValid && chatTitle.trim() !== "") {
      chatsController.createChat(chatTitle);
    }
  }

  override setProps(nextProps: Partial<ChatPageProps>) {
    super.setProps(nextProps);
    this.renderActiveLists();
  }

  protected override componentDidMount() {
    this.renderActiveLists();
  }

  private renderActiveLists() {
    const listContainer = this.refs.chatsList;
    if (listContainer) {
      listContainer.innerHTML = "";

      this.props.chatsList.forEach((chat) => {
        let formattedTime = "";
        if (chat.last_message?.time) {
          const date = new Date(chat.last_message.time);
          formattedTime = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        const chatItem = new ChatItem({
          id: chat.id,
          title: chat.title,
          avatarUrl: chat.avatar ?? "https://placehold.co",
          messageText: chat.last_message?.content ?? "Нет сообщений",
          messageTime: formattedTime,
          unreadCount: chat.unread_count,
        });

        const el = chatItem.element();
        if (el) {
          const li = document.createElement("li");
          li.className = "chats-controls__chats-item";
          li.append(el);
          listContainer.append(li);
        }
      });
    }

    const viewContainer = this.refs.chatView;
    if (viewContainer) {
      viewContainer.innerHTML = "";

      const activeChat = this.props.chatsList.find(
        (c) => c.id === this.props.activeChatId,
      );

      if (activeChat) {
        const chatScreen = new ChatScreen({
          title: activeChat.title,
          avatarUrl: activeChat.avatar ?? "https://placehold.co",
        });

        const screenEl = chatScreen.element();
        if (screenEl) {
          viewContainer.append(screenEl);

          const msgListContainer = screenEl.querySelector(
            "[ref='messagesList']",
          );
          if (msgListContainer) {
            this.props.messages.forEach((msg) => {
              const bubble = new MessageBubble({
                text: msg.content,
                time: msg.time,
                type: msg.user_id === 111 ? "outgoing" : "incoming",
              });
              const bubbleEl = bubble.element();
              if (bubbleEl) {
                msgListContainer.append(bubbleEl);
              }
            });
          }
        }
      } else {
        const placeholder = document.createElement("div");
        placeholder.className = "chat-view__placeholder";
        placeholder.textContent = "Выберите чат, чтобы начать общение";
        viewContainer.append(placeholder);
      }
    }
  }

  protected template = `
    <div class="chats-container">
      <aside class="chats-controls">
        <div class="chats-controls__header">
          {{Button text="Профиль >" className="chats-controls__button"}}
        </div>
        
        <div class="chats-create">
          <form class="chats-create__form">
            {{Input type="text" placeholder="Название нового чата" name="newChatTitle" validationType="message" className="chats-create__input"}}
            {{Button type="submit" text="Создать чат" className="chats-create__button"}}
          </form>
        </div>

        <search class="chats-search">
          <form class="chats-search__form">
            {{Input type="search" placeholder="Поиск" className="chats-search__input"}}
          </form>
        </search>
        <ul ref="chatsList" class="chats-controls__chats-list backdrop"></ul>
      </aside>
    
      <main ref="chatView" class="chat-view"></main>
    </div>
  `;
}

const mapStateToProps = (state: AppState): Record<string, unknown> => {
  return {
    chatsList: state.chats?.list ?? [],
    messages: state.chats?.messages ?? [],
    activeChatId: state.chats?.activeChatId ?? null,
  };
};

export const Chat = connect(mapStateToProps)(
  ChatPageBase as unknown as new (
    props: BlockOwnProps & Record<string, unknown>,
  ) => Block<BlockOwnProps>,
);
