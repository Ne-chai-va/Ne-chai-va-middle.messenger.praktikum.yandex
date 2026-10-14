import Block from "../framework/Block";

export class Settings extends Block {
  static componentName = "Settings";

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
    <div class="settings-container">
      <main class="settings-page backdrop">
        <div class="settings-page__user">
          <img src="https://placehold.co/200" alt="avatar" class="settings-page__image">
          {{MainTitle text="Иван" className="settings-page__title"}}
        </div>

        <div class="settings-page__data">
          <form class="settings-page__form">
            {{Input type="text" placeholder="Имя" name="first_name" ref="firstNameField" className="settings-page__input"}}
            {{Input type="text" placeholder="Фамилия" name="second_name" ref="secondNameField" className="settings-page__input"}}
            {{Input type="email" placeholder="E-mail" name="email" ref="emailField" className="settings-page__input"}}
            {{Input type="tel" placeholder="Номер телефона" name="phone" ref="phoneField" className="settings-page__input"}}
            {{Input type="text" placeholder="Логин" name="login" ref="loginField" className="settings-page__input"}}
            {{Input type="text" placeholder="Старый пароль" name="old_password" ref="oldPasswordField" className="settings-page__input"}}
            {{Input type="text" placeholder="Новый пароль" name="new_password" ref="newPasswordField" className="settings-page__input"}}

            {{Button text="Запомнить" type="submit" ref="settingsBtn" id="change-settings" className="settings-page__button"}}
          </form>
        </div>
      </main>
    </div>
  `;
}
