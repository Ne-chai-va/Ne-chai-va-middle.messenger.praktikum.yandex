import router from "./framework/Router";
import { registerComponent } from "./framework/ComponentRegistry";

import { Button } from "./components/Button/Button";
import { Input } from "./components/Input/Input";
import { MainTitle } from "./components/MainTitle/MainTitle";
import { Subtitle } from "./components/Subtitle/Subtitle";
import { ChatItem } from "./components/ChatItem/ChatItem";
import { ChatHeader } from "./components/ChatHeader/ChatHeader";
import { MessageBubble } from "./components/MessageBubble/MessageBubble";
import { ChatScreen } from "./components/ChatScreen/ChatScreen";

import { Authorization } from "./pages/Authorization";
import { Registration } from "./pages/Registration";
import { Chat } from "./pages/Chat";
import { Settings } from "./pages/Settings";
import { Error404 } from "./pages/Error404";
import { Error500 } from "./pages/Error500";

export default class App {
  public mount() {
    const root = document.querySelector<HTMLElement>("#app");
    if (!root) {
      throw new Error("Не найден корневой элемент #app в index.html");
    }

    registerComponent(Input);
    registerComponent(Button);
    registerComponent(MainTitle);
    registerComponent(Subtitle);
    registerComponent(ChatItem);
    registerComponent(ChatHeader);
    registerComponent(MessageBubble);
    registerComponent(ChatScreen);

    router
      .use("/", Authorization)
      .use("/sign-up", Registration)
      .use("/messenger", Chat)
      .use("/settings", Settings)
      .use("/500", Error500)
      .use("*", Error404)
      .start();
  }
}
