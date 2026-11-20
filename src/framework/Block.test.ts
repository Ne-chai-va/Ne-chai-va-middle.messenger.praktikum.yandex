import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockDocument, MockElement } = vi.hoisted(() => {
  class MockElement {
    tagName: string;
    innerHTML = "";
    attributes: Record<string, string> = {};
    listeners: Record<string, Function[]> = {};
    children: MockElement[] = [];

    constructor(tagName = "div") {
      this.tagName = tagName;
    }

    get content() {
      const rootEl = new MockElement("div");
      rootEl.innerHTML = this.innerHTML;

      const refMatch = this.innerHTML.match(/ref="([^"]+)"/);
      const childWithRef = new MockElement("span");
      if (refMatch) {
        childWithRef.attributes["ref"] = refMatch[1];
      }

      return {
        firstElementChild: rootEl,
        querySelectorAll: (selector: string) => {
          if (selector === "[ref]" && refMatch) {
            return [childWithRef];
          }
          return [];
        },
      };
    }

    getAttribute(name: string) {
      return this.attributes[name] || null;
    }

    removeAttribute(name: string) {
      delete this.attributes[name];
    }

    addEventListener = vi.fn((event: string, cb: Function) => {
      if (!this.listeners[event]) this.listeners[event] = [];
      this.listeners[event].push(cb);
    });

    removeEventListener = vi.fn((event: string, cb: Function) => {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter((fn) => fn !== cb);
    });

    dispatchEvent(event: { type: string }) {
      (this.listeners[event.type] || []).forEach((cb) => cb(event));
    }

    replaceWith = vi.fn();
  }

  const doc = {
    createElement: vi.fn((tag: string) => new MockElement(tag)),
  };

  vi.stubGlobal("document", doc);

  return { mockDocument: doc, MockElement };
});

import Block, { type BlockOwnProps } from "./Block";

interface TestProps extends BlockOwnProps {
  text?: string;
  onClick?: () => void;
}

class TestBlock extends Block<TestProps> {
  protected template = `<div><span>{{text}}</span><input ref="myInput" /></div>`;

  public didMountSpy = vi.fn();
  public willUnmountSpy = vi.fn();

  constructor(props: TestProps) {
    super(props);
    this.events = {
      click: (e: Event) => {
        this.props.onClick?.();
      },
    };
  }

  protected componentDidMount(): void {
    this.didMountSpy();
  }

  protected componentWillUnmount(): void {
    this.willUnmountSpy();
  }

  public getRefs() {
    return this.refs;
  }
}

describe("Block", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering and template compilation", () => {
    it("should compile Handlebars template with props and return DOM element", () => {
      const block = new TestBlock({ text: "Hello World" });
      const el = block.element();

      expect(mockDocument.createElement).toHaveBeenCalledWith("template");
      expect(el).not.toBeNull();
      expect(el?.innerHTML).toContain("Hello World");
    });

    it("should collect elements with [ref] attribute into refs and remove the attribute", () => {
      const block = new TestBlock({ text: "Test" });
      block.element();

      const refs = block.getRefs();
      expect(refs.myInput).toBeDefined();
      expect(refs.myInput.getAttribute("ref")).toBeNull();
    });
  });

  describe("Updating props (setProps)", () => {
    it("should re-render and replace DOM element when props change", () => {
      const block = new TestBlock({ text: "Initial" });
      const firstEl = block.element();

      block.setProps({ text: "Updated" });
      const secondEl = block.element();

      expect(firstEl?.replaceWith).toHaveBeenCalledWith(secondEl);
      expect(secondEl?.innerHTML).toContain("Updated");
    });

    it("should NOT re-render if passed props have the exact same values", () => {
      const block = new TestBlock({ text: "Same" });
      const el = block.element();

      block.setProps({ text: "Same" });

      expect(el?.replaceWith).not.toHaveBeenCalled();
    });
  });

  describe("Lifecycle hooks", () => {
    it("should call componentDidMount on initial render", () => {
      const block = new TestBlock({ text: "Mount test" });
      expect(block.didMountSpy).not.toHaveBeenCalled();

      block.element();
      expect(block.didMountSpy).toHaveBeenCalledTimes(1);
      expect(block.willUnmountSpy).not.toHaveBeenCalled();
    });

    it("should call componentWillUnmount before re-rendering and componentDidMount after", () => {
      const block = new TestBlock({ text: "First" });
      block.element();

      block.setProps({ text: "Second" });

      expect(block.willUnmountSpy).toHaveBeenCalledTimes(1);
      expect(block.didMountSpy).toHaveBeenCalledTimes(2);
    });

    it("should unmount child components when parent updates", () => {
      const child = new TestBlock({ text: "Child" });
      child.element();

      const parent = new TestBlock({
        text: "Parent",
        __children: [{ component: child, embed: vi.fn() }],
      });
      parent.element();

      parent.setProps({ text: "Parent Updated" });

      expect(child.willUnmountSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("DOM Events", () => {
    it("should attach event listeners on mount and trigger them", () => {
      const handleClick = vi.fn();
      const block = new TestBlock({ text: "Clickable", onClick: handleClick });
      const el = block.element() as unknown as InstanceType<typeof MockElement>;

      expect(el.addEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function),
      );

      el.dispatchEvent({ type: "click" });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should remove old event listeners when component updates", () => {
      const block = new TestBlock({ text: "First" });
      const firstEl = block.element();

      block.setProps({ text: "Second" });

      expect(firstEl?.removeEventListener).toHaveBeenCalledWith(
        "click",
        expect.any(Function),
      );
    });
  });
});
