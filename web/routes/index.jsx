import {
  EmptyState,
} from "@shopify/polaris";
import { useNavigate } from 'react-router-dom';

export default function () {
  // const [{ data, fetching, error }, act] = useGlobalAction(api.addVariantToOrder);
  const navigate = useNavigate();

  return (
    <>
      <EmptyState
        heading="Manage your Box orders"
        action={{
          content: 'Select orders',
          onAction: () => navigate("/orders"),
        }}
        secondaryAction={{
          content: 'View box Orders',
          onAction: () => window.alert('Feature not yet available'),
        }}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>Get started by selecting an order.</p>
      </EmptyState>
    </>
  );
}
