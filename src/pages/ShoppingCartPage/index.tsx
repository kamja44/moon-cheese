import { useState } from 'react';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import EmptyCartSection from './components/EmptyCartSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import { useCart } from '@/providers/CartProvider';
import type { DeliveryMethod } from '@/types';

function ShoppingCartPage() {
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<DeliveryMethod>('EXPRESS');

  const { items } = useCart();

  if (items.length === 0) {
    return <EmptyCartSection />;
  }
  return (
    <>
      <ShoppingCartSection />
      <DeliveryMethodSection selectedMethod={selectedDeliveryMethod} onSelectMethod={setSelectedDeliveryMethod} />
      <CheckoutSection selectedDeliveryMethod={selectedDeliveryMethod} />
    </>
  );
}

export default ShoppingCartPage;
