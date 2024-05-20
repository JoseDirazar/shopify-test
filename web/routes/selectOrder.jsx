import {
  Page,
  Text,
  Spinner,
  IndexTable,
  InlineStack,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { useFindMany } from "@gadgetinc/react";
import { useState, useEffect } from 'react';
import { api } from '../../web/api';

const orderSvg =
  <svg width="42px" height="42px" viewBox="0 0 1024 1024" fill="#000000" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <path d="M300 462.4h424.8v48H300v-48zM300 673.6H560v48H300v-48z" />
    <path d="M818.4 981.6H205.6c-12.8 0-24.8-2.4-36.8-7.2-11.2-4.8-21.6-11.2-29.6-20-8.8-8.8-15.2-18.4-20-29.6-4.8-12-7.2-24-7.2-36.8V250.4c0-12.8 2.4-24.8 7.2-36.8 4.8-11.2 11.2-21.6 20-29.6 8.8-8.8 18.4-15.2 29.6-20 12-4.8 24-7.2 36.8-7.2h92.8v47.2H205.6c-25.6 0-47.2 20.8-47.2 47.2v637.6c0 25.6 20.8 47.2 47.2 47.2h612c25.6 0 47.2-20.8 47.2-47.2V250.4c0-25.6-20.8-47.2-47.2-47.2H725.6v-47.2h92.8c12.8 0 24.8 2.4 36.8 7.2 11.2 4.8 21.6 11.2 29.6 20 8.8 8.8 15.2 18.4 20 29.6 4.8 12 7.2 24 7.2 36.8v637.6c0 12.8-2.4 24.8-7.2 36.8-4.8 11.2-11.2 21.6-20 29.6-8.8 8.8-18.4 15.2-29.6 20-12 5.6-24 8-36.8 8z" />
    <path d="M747.2 297.6H276.8V144c0-32.8 26.4-59.2 59.2-59.2h60.8c21.6-43.2 66.4-71.2 116-71.2 49.6 0 94.4 28 116 71.2h60.8c32.8 0 59.2 26.4 59.2 59.2l-1.6 153.6z m-423.2-47.2h376.8V144c0-6.4-5.6-12-12-12H595.2l-5.6-16c-11.2-32.8-42.4-55.2-77.6-55.2-35.2 0-66.4 22.4-77.6 55.2l-5.6 16H335.2c-6.4 0-12 5.6-12 12v106.4z" />
  </svg>

export default function () {
  const [loading, setLoading] = useState(true);
  const [orderItems, setorderItems] = useState([]);
  const navigate = useNavigate();

  const [{ data: dataOrder }] = useFindMany(api.shopifyOrder, {
    select: {
      id: true,
      name: true,
      orderLineItems: {
        edges: {
          node: {
            id: true,
            name: true,
          }
        }
      }
    }
  });

  useEffect(() => {
    setLoading(true);

    try {
      if (dataOrder) {
        const orders = dataOrder.map((order) => ({
          id: order.id,
          name: order.name,
          products: order.orderLineItems.edges?.map((edge) => edge.node),
        }));

        setorderItems(orders);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [dataOrder]);

  return (
    <section>
      {!loading && orderItems.length > 0 ? (
        <Page
          title="All Orders"
          backAction={{
            content: "Shop Information",
            onAction: () => navigate("/"),
          }}
        >
          <IndexTable
            selectable={false}
            resourceName={{
              singular: 'order',
              plural: 'orders',
            }}
            itemCount={orderItems.length}
            headings={[
              { title: 'Order Name' },
              { title: 'Products' },
            ]}
          >
            {orderItems.map(
              ({ id, name, products }, index) => (
                <IndexTable.Row
                  id={id}
                  key={id}
                  onClick={() => navigate(`/orders/${id}`)}
                  position={index}
                >
                  <IndexTable.Cell>
                    <InlineStack gap='400' blockAlign='center'>
                      {orderSvg}
                      <Text fontWeight="bold" as="span">
                        {name}
                      </Text>
                    </InlineStack>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span" >
                      {products.map((product) => product.name).join(", ")}
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
      )}
    </section>
  );
}
