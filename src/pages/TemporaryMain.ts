import Block from "../framework/Block";
import type { BlockOwnProps } from "../framework/Block";
import { tempPages } from "../utils/pages-config";

interface TemporaryMainProps extends BlockOwnProps {
  activePageId?: string;
}

export class TemporaryMain extends Block<TemporaryMainProps> {
  static componentName = "TemporaryMain";

  constructor(props: TemporaryMainProps = {}) {
    super(props);

    this.events = {
      click: (e: Event) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains("page-link")) {
          e.preventDefault();

          const pageId = target.getAttribute("data-page-id");
          if (pageId) {
            this.setProps({ activePageId: pageId });
          }
        }
      },
    };
  }

  protected componentDidMount() {
    const navList = this.refs.navList;
    if (navList) {
      tempPages.forEach((page) => {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = "#";
        a.className = "page-link";
        a.setAttribute("data-page-id", page.id);
        a.textContent = page.title;

        if (page.id === this.props.activePageId) {
          a.style.fontWeight = "bold";
        }

        li.append(a);
        navList.append(li);
      });
    }

    const contentSection = this.refs.pageContent;
    if (contentSection) {
      const activePage = tempPages.find(
        (p) => p.id === this.props.activePageId,
      );

      if (activePage) {
        const pageComponent = new activePage.Component();
        const pageElement = pageComponent.element();

        if (pageElement) {
          contentSection.append(pageElement);
        }
      } else {
        const p = document.createElement("p");
        p.textContent = "Выберите страницу из списка слева.";
        contentSection.append(p);
      }
    }
  }

  protected template = `
    <main class="temp-main">
      <nav class="temp-nav">
        <h3>Временная навигация</h3>
        <ul ref="navList">
        </ul>
      </nav>

      <section ref="pageContent" class="temp-section">
      </section>
    </main>
  `;
}
