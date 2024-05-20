import type { GadgetPermissions } from "gadget-server";

/**
 * This metadata describes the access control configuration available in your application.
 * Grants that are not defined here are set to false by default.
 *
 * View and edit your roles and permissions in the Gadget editor at https://my-shopyfy-app.gadget.app/edit/settings/permissions
 */
export const permissions: GadgetPermissions = {
  type: "gadget/permissions/v1",
  roles: {
    "shopify-app-users": {
      storageKey: "Role-Shopify-App",
      models: {
        shopifyFulfillmentService: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyFulfillmentService.gelly",
          },
        },
        shopifyGdprRequest: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyGdprRequest.gelly",
          },
        },
        shopifyOrder: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrder.gelly",
          },
        },
        shopifyOrderLineItem: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyOrderLineItem.gelly",
          },
        },
        shopifyProduct: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProduct.gelly",
          },
        },
        shopifyProductImage: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductImage.gelly",
          },
        },
        shopifyProductVariant: {
          read: {
            filter:
              "accessControl/filters/shopify/shopifyProductVariant.gelly",
          },
          actions: {
            create: true,
            delete: true,
            update: true,
          },
        },
        shopifyShop: {
          read: {
            filter: "accessControl/filters/shopify/shopifyShop.gelly",
          },
        },
        shopifySync: {
          read: {
            filter: "accessControl/filters/shopify/shopifySync.gelly",
          },
        },
      },
      actions: {
        savePrePurchaseProduct: true,
      },
    },
    unauthenticated: {
      storageKey: "unauthenticated",
      actions: {
        savePrePurchaseProduct: true,
      },
    },
  },
};
