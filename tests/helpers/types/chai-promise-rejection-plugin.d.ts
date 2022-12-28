declare module Chai {
  interface PromisedAssertion extends PromiseLike<any> { }

  type PromisedThrow = (error: Error) => PromisedAssertion;

  export interface Assertion {
    rejected: PromisedAssertion;
    rejectedWith: PromisedThrow;
  }
}
