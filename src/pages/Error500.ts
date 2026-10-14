import Block from "../framework/Block";

export class Error500 extends Block {
  static componentName = "Error500";

  constructor() {
    super({});
  }

  protected template = `
      <main class="error-page">
        {{MainTitle text="500" className="error-page__title"}}
        {{Subtitle text="Увы! Потеряли посылки по дороге!" className="error-page__subtitle"}}
      </main>
  `;
}
