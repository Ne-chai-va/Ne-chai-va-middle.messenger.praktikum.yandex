import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface MessageBubbleProps extends BlockOwnProps {
  text: string;
  time: string;
  type: "incoming" | "outgoing";
  messageClass?: string;
}

export class MessageBubble extends Block<MessageBubbleProps> {
  static componentName = "MessageBubble";

  constructor(props: MessageBubbleProps) {
    super({
      ...props,
      messageClass: props.type === "incoming" ? "incoming" : "outgoing",
    });
  }

  protected template = `
    <div class="chat-screen__message {{messageClass}}">
      <div class="message-bubble">
        {{{text}}} 
        <span class="message-meta">{{time}}</span>
      </div>
    </div>
  `;
}
