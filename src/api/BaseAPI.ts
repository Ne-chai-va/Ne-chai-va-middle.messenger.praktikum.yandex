export class BaseAPI {
  create(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  request(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  update(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  delete(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
