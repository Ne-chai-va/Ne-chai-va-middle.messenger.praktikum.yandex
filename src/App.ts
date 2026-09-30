import Handlebars from "handlebars";

// Import partials
import Input from "./components/Input/Input.hbs?raw";
import Button from "./components/Button/Button.hbs?raw";
import MainTitle from "./components/TitleMain/TitleMain.hbs?raw";
import Subtitle from "./components/Subtitle/Subtitle.hbs?raw";

// Import pages
import Auth from "./pages/Authorization.hbs?raw";
import Register from "./pages/Registration.hbs?raw";
import Error404 from "./pages/Error404.hbs?raw";
import Error500 from "./pages/Error500.hbs?raw";

// Register partials
Handlebars.registerPartial("input-item", Input);
Handlebars.registerPartial("button-item", Button);
Handlebars.registerPartial("main-title-item", MainTitle);
Handlebars.registerPartial("subtitle-item", Subtitle);

export default class App {
  appRootElement: HTMLElement;

  constructor() {
    this.appRootElement = document.getElementById("app")!;
  }

  render() {
    let template;
    template = Handlebars.compile(Error404);
    this.appRootElement.innerHTML = template({});
  }
}
