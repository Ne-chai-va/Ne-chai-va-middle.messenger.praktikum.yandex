import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface ChatHeaderProps extends BlockOwnProps {
  title: string;
  avatarUrl: string;
}

export class ChatHeader extends Block<ChatHeaderProps> {
  static componentName = "ChatHeader";

  protected template = `
    <header class="chat-screen__header">
      <div class="chat-screen__data">
        <div class="chat-screen__avatar">
          <img src="{{avatarUrl}}" alt="avatar" class="chat-screen__image" />
        </div>
        <div class="chat-screen__title">{{title}}</div>
      </div>
    </header>
  `;
}
