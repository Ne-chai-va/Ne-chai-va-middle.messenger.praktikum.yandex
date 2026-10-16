import Block from "../framework/Block";
import { Input } from "../components/Input/Input";

export class Settings extends Block {
  static componentName = "Settings";

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
    <div class="settings-container">
      <main class="settings-page backdrop">
        <div class="settings-page__user">
          <img src="https://placehold.co/200" alt="avatar" class="settings-page__image">
          {{MainTitle text="Иван" className="settings-page__title"}}
        </div>

        <div class="settings-page__data">
          <form class="settings-page__form">
            {{Input type="text" placeholder="Имя" name="first_name" validationType="name" className="settings-page__input"}}
            {{Input type="text" placeholder="Фамилия" name="second_name" validationType="name" className="settings-page__input"}}
            {{Input type="email" placeholder="E-mail" name="email" validationType="email" className="settings-page__input"}}
            {{Input type="tel" placeholder="Номер телефона" name="phone" validationType="phone" className="settings-page__input"}}
            {{Input type="text" placeholder="Логин" name="login" validationType="login" className="settings-page__input"}}
            {{Input type="text" placeholder="Старый пароль" name="old_password" validationType="password" className="settings-page__input"}}
            {{Input type="text" placeholder="Новый пароль" name="new_password" validationType="password" className="settings-page__input"}}

            {{Button text="Запомнить" type="submit" ref="settingsBtn" id="change-settings" className="settings-page__button"}}
          </form>
        </div>
      </main>
    </div>
  `;
}
