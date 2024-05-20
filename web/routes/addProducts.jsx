import {
  Page,
  Text,
  Avatar,
  InlineStack,
  IndexTable,
  useIndexResourceState,
  Spinner,
  TextField
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";
import { api } from "../../web/api";
import { useEffect, useState, useCallback } from "react";
import { useFindMany } from "@gadgetinc/react";

export default function () {
  const [loading, setLoading] = useState(true);
  const [productItems, setProductItems] = useState([]);
  const [queryValue, setQueryValue] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
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
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [dataProduct]);

  const handleQueryValueChange = useCallback((value) => {
    setQueryValue(value);
  }, []);

  useEffect(() => {
    setFilteredProducts(
      productItems.filter((product) =>
        product.name.toLowerCase().includes(queryValue.toLowerCase())
      )
    );
  }, [queryValue, productItems]);

  const previewImage = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(filteredProducts);

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
            <TextField
              label="Search products"
              value={queryValue}
              onChange={handleQueryValueChange}
              clearButton
              onClearButtonClick={() => setQueryValue("")}
              placeholder="Search by product name"
            />
            <IndexTable
              selectable={true}
              resourceName={{
                singular: 'product',
                plural: 'products',
              }}
              itemCount={filteredProducts.length}
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
              {filteredProducts.map(
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
