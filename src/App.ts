import { registerComponent } from "./framework/ComponentRegistry";
import { chats } from "./mock-data";

// Import components
import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";
import { MainTitle } from "./components/MainTitle/MainTitle";
import { Subtitle } from "./components/Subtitle/Subtitle";

// Import pages
import { Authorization } from "./pages/Authorization";
import { Registration } from "./pages/Registration";
import { Error404 } from "./pages/Error404";
import { Error500 } from "./pages/Error500";
import { Settings } from "./pages/Settings";

// Register components
registerComponent(Input);
registerComponent(Button);
registerComponent(MainTitle);
registerComponent(Subtitle);

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
