import Block from "../framework/Block";
import { type BlockOwnProps } from "../framework/Block";
import { Input } from "../components/Input/Input";
import authController from "../controllers/AuthController";
import router from "../framework/Router";
import { connect } from "../framework/connect";
import { type LoginData } from "../api/AuthAPI";
import { type AppState } from "../framework/Store";

interface AuthorizationProps extends BlockOwnProps {
  error?: string;
  isLoading?: boolean;
}

class AuthorizationBase extends Block<AuthorizationProps> {
  static componentName = "Authorization";

  constructor(props: AuthorizationProps = {}) {
    super(props);

    this.events = {
      submit: (e: Event) => {
        e.preventDefault();
        this.handleFormSubmit();
      },
      click: (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.id === "sign-up") {
          e.preventDefault();
          router.go("/sign-up");
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

    if (isFormValid) {
      authController.login(formData as unknown as LoginData);
    }
  }

  protected template = `
    <div class="auth-container">
      <main class="auth-page backdrop">
        {{MainTitle text="Вход" className="auth-page__title"}}
        <form class="auth-page__form">
          {{Input type="text" placeholder="Введите логин" name="login" validationType="login" className="auth-page__input"}}
          {{Input type="password" placeholder="Введите пароль" name="password" validationType="password" className="auth-page__input"}}
          
          <div class="auth-page__error">{{error}}</div>

          {{Button text="Войти" type="submit" ref="signInBtn" id="sign-in" className="auth-page__button"}}
          {{Button text="Зарегистрироваться" ref="signUpBtn" id="sign-up" className="auth-page__button"}}
        </form>
      </main>
    </div>
  `;
}

const mapStateToProps = (state: AppState): Record<string, unknown> => {
  return {
    error: state.auth?.loginError ?? "",
    isLoading: state.auth?.isLoading ?? false,
  };
};

export const Authorization = connect(mapStateToProps)(
  AuthorizationBase as unknown as new (
    props: BlockOwnProps & Record<string, unknown>,
  ) => Block<BlockOwnProps>,
);
