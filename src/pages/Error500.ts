import Block from "../framework/Block";

export class Error500 extends Block {
  static componentName = "Error500";

  constructor() {
    super({});
  }

  protected template = `
      <main class="error-page">
        {{MainTitle text="На сервере произошла ошибка (500)" className="error-page__title"}}
        {{Subtitle text="Мы уже знаем о проблеме и вовсю её исправляем. Пожалуйста, попробуйте обновить страницу через пару минут или вернитесь позже." className="error-page__subtitle"}}
      </main>
  `;
}
