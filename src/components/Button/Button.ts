import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface ButtonProps extends BlockOwnProps {
  text: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

export class Button extends Block<ButtonProps> {
  static componentName = "Button";

  constructor(props: ButtonProps) {
    super(props);

    if (props.onClick) {
      this.events = {
        click: props.onClick,
      };
    }
  }

  protected template = `
    <button id="{{id}}" class="button {{className}}">
      {{text}}
    </button>
  `;
}
