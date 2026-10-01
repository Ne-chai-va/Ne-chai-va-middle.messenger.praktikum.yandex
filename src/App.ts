import Handlebars from "handlebars";
import { chats } from "./mock-data";

// Import partials
import Input from "./components/Input/Input.hbs?raw";
import Button from "./components/Button/Button.hbs?raw";
import MainTitle from "./components/TitleMain/TitleMain.hbs?raw";
import Subtitle from "./components/Subtitle/Subtitle.hbs?raw";
import ChatItem from "./components/ChatItem/ChatItem.hbs?raw";

// Import pages
import Auth from "./pages/Authorization.hbs?raw";
import Register from "./pages/Registration.hbs?raw";
import Error404 from "./pages/Error404.hbs?raw";
import Error500 from "./pages/Error500.hbs?raw";
import Chat from "./pages/Chat.hbs?raw";

// Register partials
Handlebars.registerPartial("input-item", Input);
Handlebars.registerPartial("button-item", Button);
Handlebars.registerPartial("main-title-item", MainTitle);
Handlebars.registerPartial("subtitle-item", Subtitle);
Handlebars.registerPartial("chat-item", ChatItem);

export default class App {
  appRootElement: HTMLElement;

  constructor() {
    this.appRootElement = document.getElementById("app")!;
  }

  render() {
    document.body.innerHTML = Handlebars.compile(Chat)({ chats });
    // if (!navigator.cookieEnabled) {
    //   template = Handlebars.compile(Auth);
    //   this.appRootElement.innerHTML = template({});
    // } else {
    //   template = Handlebars.compile(Register);
    //   this.appRootElement.innerHTML = template({});
    // }
  }
}
