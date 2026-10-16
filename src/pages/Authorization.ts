import Block from "../framework/Block";
import { Input } from "../components/Input/Input";

export class Authorization extends Block {
  static componentName = "Authorization";

  constructor() {
    super({});

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

  protected template = `
    <div class="auth-container">
      <main class="auth-page backdrop">
        {{Subtitle text="Постскриптум — мессенджер в старинном стиле для мечтателей" className="auth-page__overline"}}
        {{MainTitle text="Вход" className="auth-page__title"}}

        <form class="auth-page__form">
          {{Input type="text" placeholder="Введите логин" name="login" validationType="login" className="auth-page__input"}}
          {{Input type="password" placeholder="Введите пароль" name="password" validationType="password" className="auth-page__input"}}

          {{Button text="Войти" type="submit" ref="signInBtn" id="sign-in" className="auth-page__button"}}
          {{Button text="Записаться" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}
