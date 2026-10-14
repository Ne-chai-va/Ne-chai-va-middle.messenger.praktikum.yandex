import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface InputProps extends BlockOwnProps {
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: Event) => void;
  className?: string;
}

export class Input extends Block<InputProps> {
  static componentName = "Input";

  constructor(props: InputProps) {
    super(props);

    if (props.onChange) {
      this.events = {
        input: props.onChange,
      };
    }
  }

  protected template = `
    <input 
      type="{{type}}" 
      placeholder="{{placeholder}}" 
      name="{{name}}" 
      value="{{value}}" 
      class="input {{className}}"
    />
  `;
}
