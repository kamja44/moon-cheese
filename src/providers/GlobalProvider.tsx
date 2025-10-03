import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';
import { CartProvider } from './CartProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EnhancedToastProvider>
      <CurrencyProvider>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </EnhancedToastProvider>
  );
};

export default GlobalProvider;
