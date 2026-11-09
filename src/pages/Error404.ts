import Block from "../framework/Block";

export class Error404 extends Block {
  static componentName = "Error404";

  constructor() {
    super({});
  }

  protected template = `
      <main class="error-page">
        {{MainTitle text="Страница не найдена (Ошибка 404)" className="error-page__title"}}
        {{Subtitle text="Кажется, этой страницы больше нет или вы ошиблись в адресе." className="error-page__subtitle"}}
      </main>
  `;
}
