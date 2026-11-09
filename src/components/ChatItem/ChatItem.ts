import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";
import chatsController from "../../controllers/ChatsController";

interface ChatItemProps extends BlockOwnProps {
  id: number;
  title: string;
  avatarUrl: string;
  messageText: string;
  messageTime: string;
  unreadCount: number;
  unreadBadgeClass?: string;
}

export class ChatItem extends Block<ChatItemProps> {
  static componentName = "ChatItem";

  constructor(props: ChatItemProps) {
    super({
      ...props,
      unreadBadgeClass: props.unreadCount > 0 ? "" : "chat-item__badge--hidden",
    });

    this.events = {
      click: () => {
        chatsController.selectChat(this.props.id);
      },
    };
  }

  protected template = `
    <div class="chat-item" data-id="{{id}}">
      <div class="chat-item__block">
        <div class="chat-item__avatar">
          <img src="{{avatarUrl}}" alt="avatar" class="chat-item__image" />
        </div>
        <div class="chat-item__text">
          <div class="chat-item__name">
            <div class="chat-item__title">{{title}}</div>
          </div>
          <div class="chat-item__message">{{{messageText}}}</div>
        </div>
        <div class="chat-item__data">
          <time class="chat-item__date" datetime="{{messageTime}}">{{messageTime}}</time>
          <span class="chat-item__badge {{unreadBadgeClass}}">{{unreadCount}}</span>
        </div>
      </div>
      <hr class="chat-item__divider" />
    </div>
  `;
}
