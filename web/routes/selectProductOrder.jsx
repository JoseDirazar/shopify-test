import {
  Page,
  Text,
  Avatar,
  Spinner,
  IndexTable,
  InlineStack,
} from "@shopify/polaris";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api";
import { useEffect, useState } from "react";
import { useFindFirst } from "@gadgetinc/react";

export default function () {
  const [loading, setLoading] = useState(true);
  const [productItems, setProductItems] = useState([]);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [{ data: dataOrder }] = useFindFirst(api.shopifyOrder, {
    filter: {
      id: {
        equals: orderId
      }
    },

    select: {
      id: true,
      name: true,
      orderLineItems: {
        edges: {
          node: {
            id: true,
            name: true,
            priceSet: true,
            product: {
              images: {
                edges: {
                  node: {
                    source: true
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  useEffect(() => {
    setLoading(true);

    try {
      if (dataOrder) {
        const products = dataOrder.orderLineItems.edges.map((product) => ({
          id: product.node.id,
          name: product.node.name,
          price: product.node.priceSet['shop_money'].amount,
          currency: product.node.priceSet['shop_money'].currency_code,
          image: product.node.product.images.edges[0]?.node.source ??
            "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081"
        }));

        setProductItems(products);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [dataOrder]);

  return (
    <section>
      {
        !loading && productItems.length > 0 ? (
          <Page
            title={`Order ${dataOrder?.name}`}
            subtitle="Select a product box from your order"
            backAction={{
              content: "Shop Information",
              onAction: () => navigate("/orders"),
            }}
          >
            <IndexTable
              selectable={false}
              resourceName={{
                singular: 'product',
                plural: 'products',
              }}
              itemCount={productItems.length}
              headings={[
                { title: 'Product Name' },
                { title: 'Price' },
              ]}
            >
              {productItems.map(
                ({ id, name, price, currency, image }, index) => (
                  <IndexTable.Row
                    id={id}
                    key={id}
                    onClick={() => navigate(`/orders/add/${id}`)}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <InlineStack gap='400' blockAlign='center'>
                        <Avatar source={image} name={name} size="xl" />
                        <Text fontWeight="bold" as="span">
                          {name}
                        </Text>
                      </InlineStack>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Text as="span" >
                        {`${price} ${currency}`}
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
          </div>
        )
      }
    </section>
  );
}
