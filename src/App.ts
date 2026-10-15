import Block from "./framework/Block";
import { registerComponent } from "./framework/ComponentRegistry";
import type { BlockOwnProps } from "./framework/Block";

// Import components
import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";
import { MainTitle } from "./components/MainTitle/MainTitle";
import { Subtitle } from "./components/Subtitle/Subtitle";
import { ChatItem } from "./components/ChatItem/ChatItem";
import { ChatHeader } from "./components/ChatHeader/ChatHeader";
import { MessageBubble } from "./components/MessageBubble/MessageBubble";
import { ChatScreen } from "./components/ChatScreen/ChatScreen";

// Import pages
import { Authorization } from "./pages/Authorization";
import { Registration } from "./pages/Registration";
import { Error404 } from "./pages/Error404";
import { Error500 } from "./pages/Error500";
import { Settings } from "./pages/Settings";
import { Chat } from "./pages/Chat";
import { TemporaryMain } from "./pages/TemporaryMain";

export const tempPages: PageConfig[] = [
  { id: "auth", title: "Авторизация", Component: Authorization },
  { id: "register", title: "Регистрация", Component: Registration },
  { id: "chat", title: "Чат", Component: Chat },
  { id: "settings", title: "Настройки профиля", Component: Settings },
  { id: "404", title: "Ошибка 404", Component: Error404 },
  { id: "500", title: "Ошибка 500", Component: Error500 },
];

interface PageConfig {
  id: string;
  title: string;
  Component: new (...args: unknown[]) => Block<BlockOwnProps>;
}

// Register components
registerComponent(Input);
registerComponent(Button);
registerComponent(MainTitle);
registerComponent(Subtitle);
registerComponent(ChatItem);
registerComponent(ChatHeader);
registerComponent(MessageBubble);
registerComponent(ChatScreen);

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
