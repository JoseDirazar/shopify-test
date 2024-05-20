import { Client } from "@gadget-client/my-shopyfy-app";

export const api = new Client({
  environment: process.env["GADGET_ENV"],
  authenticationMode: {
    apiKey: process.env["GADGET_TEST_API_KEY"],
  },
});
