import Block from "../framework/Block";
import { type BlockOwnProps } from "../framework/Block";
import { Input } from "../components/Input/Input";
import userController from "../controllers/UserController";
import { connect } from "../framework/connect";
import { store, type AppState } from "../framework/Store";
import { type ProfileData } from "../api/UserAPI";
import router from "../framework/Router";

interface SettingsProps extends BlockOwnProps {
  first_name: string;
  second_name: string;
  display_name: string;
  email: string;
  phone: string;
  login: string;
  avatar: string;
  error: string;
}

const PROFILE_FIELDS = new Set([
  "first_name",
  "second_name",
  "display_name",
  "email",
  "phone",
  "login",
]);

const PASSWORD_FIELDS = new Set(["old_password", "new_password"]);

class SettingsBase extends Block<SettingsProps> {
  static componentName = "Settings";

  constructor(props: SettingsProps) {
    super(props);

    this.events = {
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.closest("#back-to-chats")) {
          e.preventDefault();
          router.go("/messenger");
        }
      },
      submit: (e: Event) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;

        if (form.classList.contains("settings-page__avatar-form")) {
          this.handleAvatarSubmit(form);
        } else if (form.classList.contains("settings-page__profile-form")) {
          this.handleProfileSubmit();
        } else if (form.classList.contains("settings-page__password-form")) {
          this.handlePasswordSubmit();
        }
      },
    };
  }

  private handleAvatarSubmit(form: HTMLFormElement): void {
    const fileInput = form.querySelector<HTMLInputElement>(
      'input[name="avatar"]',
    );
    const file = fileInput?.files?.[0];

    if (!file) {
      store.setState("auth.error", "Выберите файл изображения");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    userController.updateAvatar(formData);
  }

  private handleProfileSubmit(): void {
    let isFormValid = true;
    const rawData: Record<string, string> = {};

    this.children.forEach((child) => {
      if (child instanceof Input && PROFILE_FIELDS.has(child.name)) {
        if (!child.validate()) {
          isFormValid = false;
        }
        rawData[child.name] = child.getValue();
      }
    });

    if (!isFormValid) {
      return;
    }

    const profileData: ProfileData = {
      first_name: rawData["first_name"],
      second_name: rawData["second_name"],
      display_name: rawData["display_name"],
      login: rawData["login"],
      email: rawData["email"],
      phone: rawData["phone"],
    };

    userController.updateProfile(profileData);
  }

  private handlePasswordSubmit(): void {
    let isFormValid = true;
    const rawData: Record<string, string> = {};

    this.children.forEach((child) => {
      if (child instanceof Input && PASSWORD_FIELDS.has(child.name)) {
        if (!child.validate()) {
          isFormValid = false;
        }
        rawData[child.name] = child.getValue();
      }
    });

    if (!isFormValid) {
      return;
    }

    const passwordData = {
      oldPassword: rawData["old_password"],
      newPassword: rawData["new_password"],
    };

    userController.updatePassword(passwordData);

    const passwordInputs = this.element()?.querySelectorAll<HTMLInputElement>(
      ".settings-page__password-form input",
    );
    passwordInputs?.forEach((input) => {
      input.value = "";
    });
  }

  protected template = `
    <div class="settings-container">
      <main class="settings-page backdrop">
        {{Button text="< Назад к чатам" id="back-to-chats" className="settings-page__button settings-page__back-button"}}

        <div class="settings-page__user">
          <img src="{{avatar}}" alt="avatar" class="settings-page__image">
          {{MainTitle text=first_name className="settings-page__title"}}

          <form class="settings-page__avatar-form">
            <input type="file" name="avatar" accept="image/*" class="settings-page__file-input" />
            {{Button text="Сменить аватар" type="submit" id="change-avatar" className="settings-page__button"}}
          </form>
        </div>

        <div class="settings-page__error">{{error}}</div>

        <div class="settings-page__data">
          <form class="settings-page__profile-form">
            {{Input type="text" placeholder="Имя" name="first_name" value=first_name validationType="name" className="settings-page__input"}}
            {{Input type="text" placeholder="Фамилия" name="second_name" value=second_name validationType="name" className="settings-page__input"}}
            {{Input type="text" placeholder="Имя в чате" name="display_name" value=display_name validationType="name" className="settings-page__input"}}
            {{Input type="email" placeholder="E-mail" name="email" value=email validationType="email" className="settings-page__input"}}
            {{Input type="tel" placeholder="Номер телефона" name="phone" value=phone validationType="phone" className="settings-page__input"}}
            {{Input type="text" placeholder="Логин" name="login" value=login validationType="login" className="settings-page__input"}}

            {{Button text="Сохранить данные" type="submit" id="change-profile" className="settings-page__button"}}
          </form>

          <form class="settings-page__password-form">
            {{Input type="password" placeholder="Старый пароль" name="old_password" validationType="password" className="settings-page__input"}}
            {{Input type="password" placeholder="Новый пароль" name="new_password" validationType="password" className="settings-page__input"}}

            {{Button text="Изменить пароль" type="submit" id="change-password" className="settings-page__button"}}
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
    display_name: user?.display_name ?? user?.first_name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    login: user?.login ?? "",
    avatar: user?.avatar
      ? "https://ya-praktikum.tech/api/v2/resources" + user.avatar
      : "https://placehold.co/200",
    error: state.user?.error ?? "",
  };
};

export const Settings = connect(mapStateToProps)(
  SettingsBase as unknown as new (
    props: BlockOwnProps & Record<string, unknown>,
  ) => Block<BlockOwnProps>,
);
