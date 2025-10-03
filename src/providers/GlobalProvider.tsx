import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EnhancedToastProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </EnhancedToastProvider>
  );
};

export default GlobalProvider;
