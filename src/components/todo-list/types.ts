type TodoListObservedProps = "name"

type PropCallback = (value: any) => void;

class TodoListProps {
  private readonly props: Map<string, any>;
  private readonly propCallbacks: Map<string, PropCallback[]>;

  constructor() {
    this.props = new Map();
    this.propCallbacks = new Map();
  }

  public addCallback(propName: string, callback: PropCallback): void {
    if (!this.props.has(propName))
      this.propCallbacks.set(propName, []);

    this.propCallbacks.get(propName).push(callback);
  }

  public getProp<T>(propName: string): T {
    return this.props.get(propName);
  }

  public updateProp(propName: string, newValue: any): void {
    this.props.set(propName, newValue);

    if (this.propCallbacks.has(propName))
      this.propCallbacks.get(propName).forEach(callback => callback(newValue));
  }
}

export type { TodoListObservedProps };
export { TodoListProps };
