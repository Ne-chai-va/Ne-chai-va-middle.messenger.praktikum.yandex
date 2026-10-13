import { registerComponent } from "./framework/ComponentRegistry";
import { chats } from "./mock-data";

// Import components
import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";

// Import pages
import { Authorization } from "./pages/Authorization";

// Register components
registerComponent(Input);
registerComponent(Button);

export default class App {
  public mount() {
    const root = document.querySelector<HTMLElement>("#app");

    if (!root) {
      throw new Error("Не найден корневой элемент #app в index.html");
    }

    const auth = new Authorization();
    const formElement = auth.element();

    if (formElement !== null) {
      root.append(formElement);
    }
  }
}
