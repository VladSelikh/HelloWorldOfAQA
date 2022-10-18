/* eslint-disable @typescript-eslint/no-explicit-any */
import Ajv from "ajv";
import { expect } from "chai"
const ajv = new Ajv({ allErrors: true });

export function validateSchema(schema: any, data: any) {
    try {
        expect(ajv.validate(schema, data)).to.be.true;
    } catch (err: any) {
        throw new Error(ajv.errorsText())
    }
}