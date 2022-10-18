/* eslint-disable @typescript-eslint/no-explicit-any */
import { METHODS } from "../support/types";
import * as getCountryByCodeSchema from "../support/schema/get-country-by-code.schema.json";
import { validateSchema } from "../support/helpers";
import { client } from "../support/https-client";
import { expect } from "chai";
import { AxiosResponse } from "axios";

let response: AxiosResponse;
let neighbors: string[];

const CODES_TO_CHECK = ["AZE", "BLR", "RUS"];

describe("Rest Countries service tests", () => {
  describe(`${METHODS.GET} method`, () => {
    for (const code of CODES_TO_CHECK) {
      it(`Should get country neighbors by the ${code} code`, async () => {
        const endpointToCheck = "/v2/alpha";

        try {
          response = await client.request(METHODS.GET, { url: endpointToCheck, params: { codes: code } });
        } catch (err: any) {
          throw new Error(err.message);
        }

        expect(response.status).to.equal(200);
        validateSchema(getCountryByCodeSchema, response.data);
        neighbors = response.data[0].borders;

        if (neighbors) {
          let responseForNeighBors: AxiosResponse;

          for (const neighbor of neighbors) {
            try {
              responseForNeighBors = await client.request(METHODS.GET, { url: endpointToCheck, params: { codes: neighbor } });
            } catch (err: any) {
              throw new Error(err.message);
            }

            expect(responseForNeighBors.status).to.equal(200);
            validateSchema(getCountryByCodeSchema, responseForNeighBors.data);

            expect(responseForNeighBors.data[0].borders).to.include(code, `${neighbor} country has no borders with ${code}`);
          }

          try {
            responseForNeighBors = await client.request(METHODS.GET, { url: endpointToCheck, params: { codes: neighbors.join(",") } });
          } catch (err: any) {
            throw new Error(err.message);
          }

          expect(responseForNeighBors.status).to.equal(200);
          validateSchema(getCountryByCodeSchema, responseForNeighBors.data);

          responseForNeighBors.data.forEach((countryData: any) => {
            expect(countryData.borders).to.include(code, `${countryData.alpha3Code} country has no borders with ${code}`);
          });
        }
      });
    }
  })
})
