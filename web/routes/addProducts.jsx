import {
  Page,
  Text,
  Avatar,
  InlineStack,
  IndexTable,
  useIndexResourceState,
  Spinner,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { api } from "../../web/api";
import { useEffect, useState } from "react";
import { useFindMany } from "@gadgetinc/react";

export default function () {
  const [loading, setLoading] = useState(true);
  const [productItems, setProductItems] = useState([]);
  const navigate = useNavigate();

  const [{ data: dataProduct }] = useFindMany(api.shopifyProduct, {
    select: {
      id: true,
      title: true,
      status: true,
      images: {
        edges: {
          node: {
            source: true
          }
        }
      },
      variants: {
        edges: {
          node: {
            id: true,
            price: true,
            inventoryQuantity: true
          }
        }
      }
    }
  });

  useEffect(() => {
    setLoading(true);

    try {
      if (dataProduct) {
        const products = dataProduct.map((product) => ({
          id: product.id,
          name: product.title,
          status: product.status,
          variantId: product.variants.edges[0]?.node.id,
          stock: product.variants.edges[0]?.node.inventoryQuantity,
          image: product.images.edges[0]?.node.source ??
            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081",
        }));
        setProductItems(products);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [dataProduct]);

  const previewImage = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(productItems);

  return (
    <section>
      {
        !loading && productItems.length > 0 ? (
          <Page
            title="Add Products to your order"
            backAction={{
              content: "Shop Information",
              onAction: () => navigate(-1),
            }}
          >
            <IndexTable
              selectable={true}
              resourceName={{
                singular: 'product',
                plural: 'products',
              }}
              itemCount={productItems.length}
              selectedItemsCount={
                allResourcesSelected ? 'All' : selectedResources.length
              }
              onSelectionChange={handleSelectionChange}
              headings={[
                { title: 'Products' },
                { title: 'Status' },
                { title: 'Inventory' },
              ]}
            >
              {productItems.map(
                ({ id, name, variantId, image, stock, status }, index) => (
                  <IndexTable.Row
                    id={id}
                    key={id}
                    selected={selectedResources.includes(id)}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <InlineStack gap='400' blockAlign='center'>
                        <Avatar source={image} size='xl' name={name} />
                        <Text fontWeight="bold" as="span">
                          {name}
                        </Text>
                      </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span">
                        {status}
                      </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span">
                        {stock} in stock
                      </Text>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ),
              )}
            </IndexTable>
          </Page>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Spinner accessibilityLabel="Spinner example" size="large" />
          </div>)
      }
    </section>
  );
}
