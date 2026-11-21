import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface MainTitleProps extends BlockOwnProps {
  text: string;
  className?: string;
}

export class MainTitle extends Block<MainTitleProps> {
  static componentName = "MainTitle";

  constructor(props: MainTitleProps) {
    super(props);
  }

  protected template = `<h1 class="main-title {{className}}">
    {{text}}
  </h1>`;
}
