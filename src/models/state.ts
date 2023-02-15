type StateUpdateHook<T> = (newValue: T, oldValue: T) => Promise<void>;

class State {
  private readonly props: Map<string, any>;
  private readonly updateHooks: Map<string, StateUpdateHook<any>[]>;

  constructor() {
    this.props = new Map();
    this.updateHooks = new Map();
  }

  public get<T>(key: string): T | undefined {
    return this.props.get(key);
  }

  public async update(key: string, newValue: any): Promise<void> {
    if (newValue === this.props.get(key))
      return;

    const oldValue = this.props.get(key);
    this.props.set(key, newValue);

    if (this.updateHooks.has(key))
      await Promise.all(this.updateHooks.get(key).map(callback => callback(newValue, oldValue)));
    else
      this.updateHooks.set(key, []);
  }

  public addUpdateHook<T>(key: string, hook: StateUpdateHook<T>): void {
    if (!this.props.has(key))
      throw new Error(`Update hook for "${key}" in the state could not be added because "${key}" does not exist`);

    this.updateHooks.get(key).push(hook);
  }

  public async addUpdateHookAndTrigger<T>(key: string, hook: StateUpdateHook<T>): Promise<void> {
    this.addUpdateHook(key, hook);

    const currentValue = this.props.get(key);
    await hook(currentValue, currentValue);
  }
}

export type { StateUpdateHook };
export { State };
