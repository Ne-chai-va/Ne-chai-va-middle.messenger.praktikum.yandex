import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";
import { validateField } from "../../utils/validate";
import type { ValidationType } from "../../utils/validate";

interface InputProps extends BlockOwnProps {
  type?: "text" | "password" | "email" | "number" | "search";
  placeholder?: string;
  name: string;
  validationType?: ValidationType;
  value?: string;
  onChange?: (e: Event) => void;
  className?: string;
}

export class Input extends Block<InputProps> {
  static componentName = "Input";

  constructor(props: InputProps) {
    super(props);

    this.events = {
      blur: () => this.validate(),
      input: () => this.clearError(),
    };
  }

  public get name(): string {
    return this.props.name;
  }

  public validate(): boolean {
    if (!this.props.validationType) return true;

    const inputEl = this.refs.nativeInput as HTMLInputElement;
    const errorEl = this.refs.errorMessage;

    const errorMessage = validateField(
      this.props.validationType,
      inputEl.value,
    );

    if (errorMessage && errorEl) {
      errorEl.textContent = errorMessage;
      this.element()?.classList.add("input-container--error");
      return false;
    }

    return true;
  }

  private clearError() {
    const errorEl = this.refs.errorMessage;
    if (errorEl) {
      errorEl.textContent = "";
      this.element()?.classList.remove("input-container--error");
    }
  }

  public getValue(): string {
    const inputEl = this.refs.nativeInput as HTMLInputElement;
    return inputEl.value;
  }

  protected template = `
    <div class="input-container">
      <input 
        ref="nativeInput"
        type="{{type}}" 
        placeholder="{{placeholder}}" 
        name="{{name}}" 
        value="{{value}}" 
        class="input {{className}}"
      />
      <span ref="errorMessage" class="input-error-message"></span>
    </div>
  `;
}
