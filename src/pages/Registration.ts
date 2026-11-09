import Block from "../framework/Block";
import { type BlockOwnProps } from "../framework/Block";
import { Input } from "../components/Input/Input";
import registerController from "../controllers/RegisterController";
import router from "../framework/Router";
import { connect } from "../framework/connect";
import { type RegisterData } from "../api/RegisterAPI";
import { type AppState } from "../framework/Store";

interface RegistrationProps extends BlockOwnProps {
  error?: string;
  isLoading?: boolean;
}

class RegistrationBase extends Block<RegistrationProps> {
  static componentName = "Registration";

  constructor(props: RegistrationProps = {}) {
    super(props);

    this.events = {
      submit: (e: Event) => {
        e.preventDefault();
        this.handleFormSubmit();
      },
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.id === "sign-in") {
          e.preventDefault();
          router.go("/");
        }
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

    if (formData["password"] !== formData["password_check"]) {
      isFormValid = false;
      console.error("Пароли не совпадают");
    }

    if (isFormValid) {
      const apiData = { ...formData };
      delete apiData.password_check;
      registerController.register(apiData as unknown as RegisterData);
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
          {{Input type="password" placeholder="Пароль" name="password" validationType="password" className="register-page__input"}}
          {{Input type="password" placeholder="Повторите пароль" name="password_check" validationType="password" className="register-page__input"}}

          <div class="register-page__error">{{error}}</div>

          {{Button text="Зарегистрироваться" type="submit" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
          {{Button text="Войти" ref="signInBtn" id="sign-in" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}

const mapStateToProps = (state: AppState): Record<string, unknown> => {
  return {
    error: state.auth?.registerError ?? "",
    isLoading: state.auth?.isLoading ?? false,
  };
};

export const Registration = connect(mapStateToProps)(
  RegistrationBase as unknown as new (
    props: BlockOwnProps & Record<string, unknown>,
  ) => Block<BlockOwnProps>,
);
