import Block from "../framework/Block";
import { type BlockOwnProps } from "../framework/Block";
import { Input } from "../components/Input/Input";
import userController from "../controllers/UserController";
import { connect } from "../framework/connect";
import { type AppState } from "../framework/Store";
import { type ProfileData, type PasswordData } from "../api/UserAPI";

interface SettingsProps extends BlockOwnProps {
  first_name: string;
  second_name: string;
  email: string;
  phone: string;
  login: string;
  avatar: string;
  error: string;
}

class SettingsBase extends Block<SettingsProps> {
  static componentName = "Settings";

  constructor(props: SettingsProps) {
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
    const rawData: Record<string, string> = {};

    const form = this.element()?.querySelector(".settings-page__form");
    if (!form) return;

    this.children.forEach((child) => {
      if (child instanceof Input) {
        const isFieldValid = child.validate();
        if (!isFieldValid) {
          isFormValid = false;
        }
        rawData[child.name] = child.getValue();
      }
    });

    if (isFormValid) {
      const profileData: ProfileData = {
        first_name: rawData["first_name"],
        second_name: rawData["second_name"],
        display_name: rawData["first_name"],
        login: rawData["login"],
        email: rawData["email"],
        phone: rawData["phone"],
      };

      let passwordData: PasswordData | null = null;
      if (rawData["old_password"] || rawData["new_password"]) {
        passwordData = {
          oldPassword: rawData["old_password"],
          newPassword: rawData["new_password"],
        };
      }

      userController.updateProfile(profileData, passwordData);
    }
  }

  protected template = `
    <div class="settings-container">
      <main class="settings-page backdrop">
        <div class="settings-page__user">
          <img src="{{avatar}}" alt="avatar" class="settings-page__image">
          {{MainTitle text=first_name className="settings-page__title"}}
        </div>

        <div class="settings-page__data">
          <form class="settings-page__form">
            {{Input type="text" placeholder="Имя" name="first_name" value=first_name validationType="name" className="settings-page__input"}}
            {{Input type="text" placeholder="Фамилия" name="second_name" value=second_name validationType="name" className="settings-page__input"}}
            {{Input type="email" placeholder="E-mail" name="email" value=email validationType="email" className="settings-page__input"}}
            {{Input type="tel" placeholder="Номер телефона" name="phone" value=phone validationType="phone" className="settings-page__input"}}
            {{Input type="text" placeholder="Логин" name="login" value=login validationType="login" className="settings-page__input"}}
            {{Input type="password" placeholder="Старый пароль" name="old_password" validationType="password" className="settings-page__input"}}
            {{Input type="password" placeholder="Новый пароль" name="new_password" validationType="password" className="settings-page__input"}}

            <div class="settings-page__error">{{error}}</div>

            {{Button text="Запомнить" type="submit" ref="settingsBtn" id="change-settings" className="settings-page__button"}}
          </form>
        </div>
      </main>
    </div>
  `;
}

const mapStateToProps = (state: AppState): Record<string, unknown> => {
  const user = state.auth?.user;
  return {
    first_name: user?.first_name ?? "Имя",
    second_name: user?.second_name ?? "Фамилия",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    login: user?.login ?? "",
    avatar: user?.avatar
      ? `https://ya-praktikum.tech{user.avatar}`
      : "https://placehold.co/200",
    error: state.auth?.error ?? "",
  };
};

export const Settings = connect(mapStateToProps)(
  SettingsBase as unknown as new (
    props: BlockOwnProps & Record<string, unknown>,
  ) => Block<BlockOwnProps>,
);
