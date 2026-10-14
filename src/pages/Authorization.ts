import Block from "../framework/Block";

export class Authorization extends Block {
  static componentName = "Authorization";

  constructor() {
    super({});

    this.events = {
      click: (e: Event) => {
        if (e.target === this.refs.signInBtn) {
          e.preventDefault();

          const loginInput = this.refs.loginField as HTMLInputElement;
          const passwordInput = this.refs.passwordField as HTMLInputElement;

          console.log("Логин:", loginInput.value);
          console.log("Пароль:", passwordInput.value);
        }
      },
    };
  }

  protected template = `
    <div class="auth-container">
      <main class="auth-page backdrop">
        {{Subtitle text="Постскриптум — мессенджер в старинном стиле для мечтателей" className="auth-page__overline"}}
        {{MainTitle text="Вход" className="auth-page__title"}}

        <form class="auth-page__form">
          {{Input type="text" placeholder="Введите логин" name="login" ref="loginField" className="auth-page__input"}}
          {{Input type="password" placeholder="Введите пароль" name="password" ref="passwordField" className="auth-page__input"}}

          {{Button text="Войти" type="submit" ref="signInBtn" id="sign-in" className="auth-page__button"}}
          {{Button text="Записаться" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}
