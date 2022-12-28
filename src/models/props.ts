type PropCallback = (value: any) => Promise<void>;

class Props {
  private readonly props: Map<string, any>;
  private readonly propCallbacks: Map<string, PropCallback[]>;

  constructor() {
    this.props = new Map();
    this.propCallbacks = new Map();
  }

  public getProp<T>(propName: string): T | undefined {
    return this.props.get(propName);
  }

  public async updateProp(propName: string, newValue: any): Promise<void> {
    if (newValue === this.props.get(propName))
      return;

    this.props.set(propName, newValue);

    if (this.propCallbacks.has(propName))
      await Promise.all(this.propCallbacks.get(propName).map(callback => callback(newValue)));
    else
      this.propCallbacks.set(propName, []);
  }

  public addCallback(propName: string, callback: PropCallback): void {
    if (!this.props.has(propName))
      throw new Error(`Callback for prop "${propName}" could not be added because prop "${propName}" does not exist`);

    this.propCallbacks.get(propName).push(callback);
  }

  public async addCallbackAndTrigger(propName: string, callback: PropCallback): Promise<void> {
    this.addCallback(propName, callback);

    await callback(this.props.get(propName));
  }
}

export type { PropCallback };
export { Props };
