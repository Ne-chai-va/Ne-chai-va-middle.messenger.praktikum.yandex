import Block from "../framework/Block";

export class Error404 extends Block {
  static componentName = "Error404";

  constructor() {
    super({});
  }

  protected template = `
      <main class="error-page">
        {{MainTitle text="404" className="error-page__title"}}
        {{Subtitle text="Увы! Не то почтовое отделение!" className="error-page__subtitle"}}
      </main>
  `;
}
