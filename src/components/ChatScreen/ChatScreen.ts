import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";
import { Input } from "../Input/Input";
import chatsController from "../../controllers/ChatsController";

interface ChatScreenProps extends BlockOwnProps {
  title: string;
  avatarUrl: string;
}

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
    let messageText = "";

    this.children.forEach((child) => {
      if (child instanceof Input && child.name === "message") {
        const isFieldValid = child.validate();
        if (!isFieldValid) {
          isFormValid = false;
        }
        messageText = child.getValue();
      }
    });

    if (isFormValid && messageText.trim() !== "") {
      chatsController.sendMessage(messageText);
    }
  }

  protected template = `
    <div class="chat-screen">
      {{ChatHeader title=title avatarUrl=avatarUrl}}
      
      <hr class="chat-screen__divider" />
      
      <div ref="messagesList" class="chat-screen__messages">
      </div>
      
      <div class="chat-screen__send-message">
        <form class="chat-screen__form"> 
          {{Input type="text" placeholder="Напишите письмо..." className="chat-screen__input" name="message" validationType="message"}}
          {{Button type="submit" className="chat-screen__send-button" text="Отправить"}}
        </form>
      </div>
    </div>
  `;
}
