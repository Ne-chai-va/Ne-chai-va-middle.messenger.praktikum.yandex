import { TemporaryMain } from "./pages/TemporaryMain";

export default class App {
  public mount() {
    const root = document.querySelector<HTMLElement>("#app");

    if (!root) {
      throw new Error("Не найден корневой элемент #app в index.html");
    }

    const tempMain = new TemporaryMain();
    const element = tempMain.element();

    if (element) {
      root.append(element);
    }
  }
}
