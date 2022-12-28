export default function(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils): void {
  const Assertion = chai.Assertion;

  function assertPromiseType(assertion: Chai.AssertionPrototype): void {
    if (!(assertion._obj instanceof Promise))
      throw new TypeError(`${utils.inspect(assertion._obj)} is not a promise`);
  }

  function addProperty(
    name: string,
    assertion: (this: Chai.AssertionStatic) => Promise<void>
  ): void {
    Assertion.addProperty(name, function(this: Chai.AssertionStatic) {
      assertPromiseType(this);
      return assertion.apply(this);
    });
  }

  function addMethod(name: string, assertion: (this: Chai.AssertionStatic, ...args: any) => any): void {
    Assertion.addMethod(name, function(this: Chai.AssertionStatic) {
      assertPromiseType(this);
      /* eslint-disable */
      return assertion.apply(this, arguments);
      /* eslint-enable */
    });
  }

  function assertIfNegated(assertion: Chai.AssertionStatic, message: Chai.Message, extra: any): void {
    assertion.assert(true, null, message, extra.expected, extra.actual);
  }

  function assertIfNotNegated(assertion: Chai.AssertionStatic, message: Chai.Message, extra: any): void {
    assertion.assert(false, message, null, extra.expected, extra.actual);
  }

  addProperty("rejected", async function(this: Chai.AssertionStatic): Promise<void> {
    const promise = utils.flag(this, "object") as Promise<any>;
    try {
      const value = await promise;
      assertIfNotNegated(
        this,
        "expected promise to be rejected but it was fulfilled with #{act}",
        { actual: value }
      );
    }
    catch (ex) {
      const error = ex as Error;
      assertIfNegated(
        this,
        "expected promise not to be rejected but it was rejected with #{act}",
        { actual: error.toString() }
      );
    }
  });

  addMethod("rejectedWith", async function(this: Chai.AssertionStatic, expectedError: Error) {
    const promise = utils.flag(this, "object") as Promise<any>;
    try {
      const value = await promise;
      assertIfNotNegated(
        this,
        "expected promise to be rejected but it was fulfilled with #{act}",
        { actual: value }
      );
    }
    catch (ex) {
      const error = ex as Error;
      const negate = utils.flag(this, "negate") as boolean;
      const assertion = new Assertion(error.toString());
      if (!negate) {
        assertion.to.equal(
          expectedError.toString(),
          `expected promise to be rejected with ${expectedError.toString()} but received ${error.toString()}`
        );
      }
      else {
        assertion.to.not.equal(
          expectedError.toString(),
          `expected promise not to be rejected with ${expectedError.toString()}`
        );
      }
    }
  });
}
