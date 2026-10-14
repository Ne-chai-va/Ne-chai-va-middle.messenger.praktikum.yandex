import Block from "../framework/Block";

export class Registration extends Block {
  static componentName = "Registration";

  constructor() {
    super({});

    this.events = {
      click: (e: Event) => {
        if (e.target === this.refs.signInBtn) {
          e.preventDefault();

          // ДОБАВИТЬ ЛОГИКУ ИВЕНТОВ!!
        }
      },
    };
  }

  protected template = `
    <div class="register-container">
      <main class="register-page backdrop">
        {{MainTitle text="Регистрация" className="register-page__title"}}

        <form class="register-page__form">
          {{Input type="text" placeholder="Имя" name="first_name" ref="firstNameField" className="register-page__input"}}
          {{Input type="text" placeholder="Фамилия" name="second_name" ref="secondNameField" className="register-page__input"}}
          {{Input type="email" placeholder="E-mail" name="email" ref="emailField" className="register-page__input"}}
          {{Input type="tel" placeholder="Номер телефона" name="phone" ref="phoneField" className="register-page__input"}}
          {{Input type="text" placeholder="Логин" name="login" ref="loginField" className="register-page__input"}}
          {{Input type="text" placeholder="Пароль" name="password" ref="passwordField" className="register-page__input"}}
          {{Input type="text" placeholder="Пароль ещё раз" name="password_check" ref="passwordCheckField" className="register-page__input"}}

          {{Button text="Записаться" type="submit" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
          {{Button text="Войти" ref="signInBtn" id="sign-in" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}
