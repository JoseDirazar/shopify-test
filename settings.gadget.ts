import type { GadgetSettings } from "gadget-server";

export const settings: GadgetSettings = {
  type: "gadget/settings/v1",
  frameworkVersion: "v1.0.0",
  plugins: {
    connections: {
      shopify: {
        apiVersion: "2024-04",
        enabledModels: [
          "shopifyFulfillmentService",
          "shopifyOrder",
          "shopifyOrderLineItem",
          "shopifyProduct",
          "shopifyProductImage",
          "shopifyProductVariant",
        ],
        type: "partner",
        scopes: [
          "read_products",
          "write_products",
          "write_orders",
          "read_orders",
          "read_fulfillments",
        ],
      },
    },
  },
};
