import Block from "../framework/Block";
import { Input } from "../components/Input/Input";

export class Registration extends Block {
  static componentName = "Registration";

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
    <div class="register-container">
      <main class="register-page backdrop">
        {{MainTitle text="Регистрация" className="register-page__title"}}

        <form class="register-page__form">
          {{Input type="text" placeholder="Имя" name="first_name" validationType="name" className="register-page__input"}}
          {{Input type="text" placeholder="Фамилия" name="second_name" validationType="name" className="register-page__input"}}
          {{Input type="email" placeholder="E-mail" name="email" validationType="email" className="register-page__input"}}
          {{Input type="tel" placeholder="Номер телефона" name="phone" validationType="phone" className="register-page__input"}}
          {{Input type="text" placeholder="Логин" name="login" validationType="login" className="register-page__input"}}
          {{Input type="text" placeholder="Пароль" name="password" validationType="password" className="register-page__input"}}
          {{Input type="text" placeholder="Пароль ещё раз" name="password_check" validationType="password" className="register-page__input"}}

          {{Button text="Записаться" type="submit" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
          {{Button text="Войти" ref="signInBtn" id="sign-in" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}
