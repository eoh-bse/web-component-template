type PropCallback = (value: any) => void;

class Props {
  private readonly props: Map<string, any>;
  private readonly propCallbacks: Map<string, PropCallback[]>;

  constructor() {
    this.props = new Map();
    this.propCallbacks = new Map();
  }

  public getProp<T>(propName: string): T {
    return this.props.get(propName);
  }

  public updateProp(propName: string, newValue: any): void {
    this.props.set(propName, newValue);

    if (this.propCallbacks.has(propName))
      this.propCallbacks.get(propName).forEach(callback => callback(newValue));
    else
      this.propCallbacks.set(propName, []);
  }

  public addCallback(propName: string, triggerNow: boolean, callback: PropCallback): void {
    if (!this.props.has(propName))
      throw new Error(`Callback for prop ${propName} could not be added because prop ${propName} does not exist`);

    this.propCallbacks.get(propName).push(callback);

    if (triggerNow)
      callback(this.props.get(propName));
  }
}

export type { PropCallback };
export { Props };
