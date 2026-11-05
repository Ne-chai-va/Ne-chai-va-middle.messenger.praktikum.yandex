import merge from "../utils/merge";
import { type Indexed } from "../utils/merge";
import set from "../utils/set";

export interface LastMessageData {
  user: {
    first_name: string;
    second_name: string;
    avatar: string;
    email: string;
    login: string;
    phone: string;
  };
  time: string;
  content: string;
}

export interface ChatData {
  id: number;
  title: string;
  avatar: string | null;
  unread_count: number;
  last_message: LastMessageData | null;
}

export interface MessageData {
  id: number;
  user_id: number;
  chat_id: number;
  type: "message" | "file";
  time: string;
  content: string;
  is_read: boolean;
}

export interface AppState extends Indexed {
  chats?: {
    list: ChatData[];
    activeChatId: number | null;
    messages: MessageData[];
    isLoading: boolean;
    error: string | null;
  };
}

export interface UserData {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  email: string;
  phone: string;
}

export interface AppState extends Indexed {
  auth?: {
    user: UserData | null;
    error: string | null;
    isLoading: boolean;
  };
}

type Listener = () => void;

class Store {
  private state: AppState = {};
  private listeners: Set<Listener> = new Set();

  public getState(): AppState {
    return this.state;
  }

  public setState(path: string, value: unknown) {
    const resultSet = set({}, path, value) as Indexed;
    this.state = merge(this.state, resultSet) as AppState;
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
