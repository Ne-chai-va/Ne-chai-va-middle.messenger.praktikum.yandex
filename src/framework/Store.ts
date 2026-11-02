import merge from "../utils/merge";
import { type Indexed } from "../utils/merge";
import set from "../utils/set";

type Listener = () => void;

class Store {
  private state: Indexed = {};
  private listeners: Set<Listener> = new Set();

  public getState() {
    return this.state;
  }

  public setState(path: string, value: unknown) {
    const resultSet = set({}, path, value) as Indexed;
    this.state = merge(this.state, resultSet);
    this.emit();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    this.listeners.forEach((listener) => listener());
  }
}

export const store = new Store();
