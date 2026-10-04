import Handlebars from "handlebars";
import { chats } from "./mock-data";

// Import partials
import Input from "./components/Input/Input.hbs?raw";
import Button from "./components/Button/Button.hbs?raw";
import MainTitle from "./components/TitleMain/TitleMain.hbs?raw";
import Subtitle from "./components/Subtitle/Subtitle.hbs?raw";
import ChatItem from "./components/ChatItem/ChatItem.hbs?raw";
import ChatScreen from "./components/ChatScreen/ChatScreen.hbs?raw";

// Import pages
import Main from "./pages/TemporaryMain.hbs?raw";
import Auth from "./pages/Authorization.hbs?raw";
import Register from "./pages/Registration.hbs?raw";
import Error404 from "./pages/Error404.hbs?raw";
import Error500 from "./pages/Error500.hbs?raw";
import Settings from "./pages/Settings.hbs?raw";
import Chat from "./pages/Chat.hbs?raw";

const pages = [
  { id: "auth", title: "Страница авторизации", template: Auth },
  { id: "reg", title: "Страница регистрации", template: Register },
  { id: "chat", title: "Страница списка чатов и переписки", template: Chat },
  {
    id: "settings",
    title: "Страница настроек пользователя",
    template: Settings,
  },
  { id: "404", title: "Служебные страницы (404)", template: Error404 },
  { id: "500", title: "Служебные страницы (500)", template: Error500 },
];

// Register partials
Handlebars.registerPartial("input-item", Input);
Handlebars.registerPartial("button-item", Button);
Handlebars.registerPartial("main-title-item", MainTitle);
Handlebars.registerPartial("subtitle-item", Subtitle);
Handlebars.registerPartial("chat-item", ChatItem);
Handlebars.registerPartial("chat-screen", ChatScreen);

export default class App {
  appRootElement: HTMLElement;
  currentPageId: string | null = null;

  constructor() {
    this.appRootElement = document.getElementById("app")!;
    this.setupListeners();
  }

  setupListeners() {
    document.body.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains("page-link")) {
        event.preventDefault();
        const pageId = target.getAttribute("data-page-id");
        if (pageId) {
          this.currentPageId = pageId;
          this.render();
        }
      }
    });
  }

  render() {
    const mainTemplate = Handlebars.compile(Main);
    const currentPage = pages.find((p) => p.id === this.currentPageId);
    let pageContent = "";
    if (currentPage) {
      pageContent = Handlebars.compile(currentPage.template)({ chats });
    }
    document.body.innerHTML = mainTemplate({
      pages,
      pageContent,
    });
  }
}
