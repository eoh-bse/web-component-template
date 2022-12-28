import { chai } from "@open-wc/testing";
import chaiPromiseRejectionPlugin from "./chai-promise-rejection-plugin";

chai.use(chaiPromiseRejectionPlugin);

export const expect = chai.expect;
