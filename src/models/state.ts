type StateUpdateHook = (value: any) => Promise<void>;

class State {
  private readonly props: Map<string, any>;
  private readonly updateHooks: Map<string, StateUpdateHook[]>;

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

    this.props.set(key, newValue);

    if (this.updateHooks.has(key))
      await Promise.all(this.updateHooks.get(key).map(callback => callback(newValue)));
    else
      this.updateHooks.set(key, []);
  }

  public addUpdateHook(key: string, hook: StateUpdateHook): void {
    if (!this.props.has(key))
      throw new Error(`Update hook for "${key}" in the state could not be added because "${key}" does not exist`);

    this.updateHooks.get(key).push(hook);
  }

  public async addUpdateHookAndTrigger(key: string, hook: StateUpdateHook): Promise<void> {
    this.addUpdateHook(key, hook);

    await hook(this.props.get(key));
  }
}

export type { StateUpdateHook };
export { State };
