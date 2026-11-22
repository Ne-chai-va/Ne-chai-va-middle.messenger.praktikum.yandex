import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";
import { Input } from "../Input/Input";
import chatsController from "../../controllers/ChatsController";

interface ChatHeaderProps extends BlockOwnProps {
  title: string;
  avatarUrl: string;
  chatId: number;
}

export class ChatHeader extends Block<ChatHeaderProps> {
  static componentName = "ChatHeader";

  constructor(props: ChatHeaderProps) {
    super(props);

    this.events = {
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest("#delete-chat-btn")) {
          e.preventDefault();
          if (
            confirm(`Вы уверены, что хотите удалить чат "${this.props.title}"?`)
          ) {
            chatsController.deleteChat(this.props.chatId);
          }
        }
      },
      submit: (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const targetForm = form.closest("form") || (e.target as HTMLElement);

        if (targetForm.classList.contains("chat-management__form-add")) {
          this.handleUserAction("addUserId", "add");
        } else if (
          targetForm.classList.contains("chat-management__form-remove")
        ) {
          this.handleUserAction("removeUserId", "remove");
        }
      },
    };
  }

  private handleUserAction(inputName: string, action: "add" | "remove") {
    const inputComponent = this.children.find(
      (child): child is Input =>
        child instanceof Input && child.name === inputName,
    );

    if (!inputComponent) return;

    const rawValue = inputComponent.getValue().trim();
    const userId = Number(rawValue);

    if (!rawValue || isNaN(userId)) {
      alert("Пожалуйста, введите числовой ID пользователя");
      return;
    }

    if (action === "add") {
      chatsController.addUserToChat(this.props.chatId, userId);
    } else {
      chatsController.removeUserFromChat(this.props.chatId, userId);
    }

    const nativeInput = inputComponent.element()?.querySelector("input");
    if (nativeInput) {
      nativeInput.value = "";
    }
  }

  protected template = `
    <header class="chat-screen__header backdrop">
      <div class="chat-screen__data">
        <div class="chat-screen__avatar">
          <img src="{{avatarUrl}}" alt="avatar" class="chat-screen__image" />
        </div>
        <div class="chat-screen__title">{{title}}</div>
      </div>

      <div class="chat-management">
        <form class="chat-management__form chat-management__form-add">
          {{Input type="text" placeholder="ID пользователя" name="addUserId" className="chat-management__input"}}
          {{Button type="submit" text="Добавить" className="chat-management__btn chat-management__btn--add"}}
        </form>
        
        <form class="chat-management__form chat-management__form-remove">
          {{Input type="text" placeholder="ID пользователя" name="removeUserId" className="chat-management__input"}}
          {{Button type="submit" text="Исключить" className="chat-management__btn chat-management__btn--remove"}}
        </form>
        
        {{Button text="Удалить чат" id="delete-chat-btn" className="chat-management__btn chat-management__btn--danger"}}
      </div>
    </header>
  `;
}
