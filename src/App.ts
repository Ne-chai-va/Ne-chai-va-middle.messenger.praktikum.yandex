import Handlebars from "handlebars";

// Import partials
import Input from "./components/Input/Input.hbs?raw";
import Button from "./components/Button/Button.hbs?raw";

// Import pages
import Auth from "./pages/Authorization.hbs?raw";
import Register from "./pages/Registration.hbs?raw";
import Error404 from "./pages/Error404.hbs?raw";
import Error500 from "./pages/Error500.hbs?raw";

// Register partials
Handlebars.registerPartial("input-item", Input);
Handlebars.registerPartial("button-item", Button);

export default class App {
  appRootElement: HTMLElement;

  constructor() {
    this.appRootElement = document.getElementById("app")!;
  }

  render() {
    let template;
    template = Handlebars.compile(Error500);
    this.appRootElement.innerHTML = template({});
  }
}
