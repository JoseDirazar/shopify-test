import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "session" model, go to https://my-shopyfy-app.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "4_98Nxltq1sF",
  fields: {
    roles: {
      type: "roleList",
      default: ["unauthenticated"],
      storageKey: "nQ93nM5Ib13y",
    },
  },
  shopify: { fields: ["shop", "shopifySID"] },
};
