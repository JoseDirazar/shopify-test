import {
  applyParams,
  preventCrossShopDataAccess,
  ActionOptions,
  SavePrePurchaseProductShopifyShopActionContext,
} from "gadget-server";

/**
 * @param { SavePrePurchaseProductShopifyShopActionContext } context
 */
export async function run({ params, record, logger, connections }) {
  applyParams(params, record);
  await preventCrossShopDataAccess(params, record);

  // get the product id passed in as a custom param
  const { productId } = params;

  // save the selected pre-purchase product in a SHOP-owned metafield
  // https://www.npmjs.com/package/shopify-api-node#metafields
  const response = await connections.shopify.current?.metafield.create({
    key: "pre-purchase-product",
    namespace: "gadget-tutorial",
    owner_id: record.id,
    type: "product_reference",
    value: productId,
  });

  // print to the Gadget Logs
  logger.info({ response }, "add metafields response");
}

// define a productId custom param for this action
export const params = {
  productId: { type: "string" },
};

/** @type { ActionOptions } */
export const options = {
  actionType: "custom",
  triggers: { api: true },
};
