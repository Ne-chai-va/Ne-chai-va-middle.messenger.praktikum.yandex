export const WSTransportEvents = {
  Connected: "connected",
  Error: "error",
  Message: "message",
  Close: "close",
} as const;

type EventCallback = (data?: unknown) => void;

export class WSTransport {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly pingIntervalTime = 15000;
  private url: string;
  private listeners: Record<string, EventCallback[]> = {};

  constructor(url: string) {
    this.url = url;
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  private emit(event: string, data?: unknown): void {
    this.listeners[event]?.forEach((listener) => listener(data));
  }

  public connect(): Promise<void> {
    if (this.socket) {
      throw new Error("Сокет уже подключен");
    }

    this.socket = new WebSocket(this.url);
    this.subscribe(this.socket);

    return new Promise((resolve, reject) => {
      this.on(WSTransportEvents.Error, reject);
      this.on(WSTransportEvents.Connected, () => {
        this.setupPing();
        resolve();
      });
    });
  }

  public send(data: string | number | object): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("Сокет не подключен");
    }
    this.socket.send(JSON.stringify(data));
  }

  public close(): void {
    this.socket?.close();
    this.clearPing();
  }

  private setupPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: "ping" });
    }, this.pingIntervalTime);

    this.on(WSTransportEvents.Close, () => {
      this.clearPing();
    });
  }

  private clearPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private subscribe(socket: WebSocket): void {
    socket.addEventListener("open", () => {
      this.emit(WSTransportEvents.Connected);
    });

    socket.addEventListener("close", () => {
      this.clearPing();
      this.socket = null;
      this.emit(WSTransportEvents.Close);
    });

    socket.addEventListener("error", (e) => {
      this.emit(WSTransportEvents.Error, e);
    });

    socket.addEventListener("message", (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === "pong" || data.type === "user connected") {
          return;
        }
        this.emit(WSTransportEvents.Message, data);
      } catch (e) {
        console.error("Ошибка парсинга WS сообщения:", e);
      }
    });
  }
}
