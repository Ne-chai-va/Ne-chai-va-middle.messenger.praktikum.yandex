import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { Input } from "../Input/Input";

interface ChatScreenProps extends BlockOwnProps {
  title: string;
  avatarUrl?: string;
}

const mockMessages = [
  {
    text: "Подскажи, как лучше всего сверстать контейнер для сообщений?",
    time: "18:20",
    type: "outgoing",
  },
  {
    text: "Здравствуй! Теперь я знаю, как сделать это лучше!",
    time: "18:22",
    type: "incoming",
  },
  {
    text: "Замечательно! У нас есть время на рефакторинг.",
    time: "18:24",
    type: "outgoing",
  },
] as const;

export class ChatScreen extends Block<ChatScreenProps> {
  static componentName = "ChatScreen";

  constructor(props: ChatScreenProps) {
    super(props);

    this.events = {
      submit: (e: Event) => {
        e.preventDefault();
        this.handleFormSubmit();
      },
    };
  }

  private handleFormSubmit() {
    let isFormValid = true;
    const formData: Record<string, string> = {};

    this.children.forEach((child) => {
      if (child instanceof Input) {
        const isFieldValid = child.validate();

        if (!isFieldValid) {
          isFormValid = false;
        }

        const fieldName = child.name;
        formData[fieldName] = child.getValue();
      }
    });

    if (isFormValid) {
      console.log("Форма валидна. Объект с данными отправки:", formData);
    } else {
      console.log("Форма содержит ошибки, отправка заблокирована.");
    }
  }

  protected componentDidMount() {
    const messagesContainer = this.refs.messagesList;

    if (messagesContainer) {
      mockMessages.forEach((msgData) => {
        const message = new MessageBubble(msgData);
        const msgElement = message.element();
        if (msgElement) {
          messagesContainer.append(msgElement);
        }
      });
    }
  }

  protected template = `
    <div class="chat-screen">
      {{ChatHeader title=title avatarUrl=avatarUrl}}
      
      <hr class="chat-screen__divider" />
      
      <div ref="messagesList" class="chat-screen__messages"></div>
      
      <div class="chat-screen__send-message">
        <form class="chat-screen__form"> 
          {{Input type="text" placeholder="Напишите письмо..." className="chat-screen__input" name="message" validationType="message"}}
          {{Button type="submit" className="chat-screen__send-button" text="Отправить"}}
        </form>
      </div>
    </div>
  `;
}
