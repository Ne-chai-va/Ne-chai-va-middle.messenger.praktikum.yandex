export abstract class BaseAPI {
  create?(data?: unknown): Promise<unknown>;
  request?(data?: unknown): Promise<unknown>;
  update?(data?: unknown): Promise<unknown>;
  delete?(data?: unknown): Promise<unknown>;
}
