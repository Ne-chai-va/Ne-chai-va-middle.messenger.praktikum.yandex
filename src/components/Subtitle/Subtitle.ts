import Block from "../../framework/Block";
import type { BlockOwnProps } from "../../framework/Block";

interface SubtitleProps extends BlockOwnProps {
  text: string;
  className?: string;
}

export class Subtitle extends Block<SubtitleProps> {
  static componentName = "Subtitle";

  constructor(props: SubtitleProps) {
    super(props);
  }

  protected template = `<p class="subtitle {{className}}">
    {{text}}
  </p>`;
}
