import type { Currency, ExchangeRateResponse } from '@/types';
import { http } from '@/utils/http';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  exchangeRate: ExchangeRateResponse['exchangeRate'] | null;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (price: number) => string;
  symbol: string;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateResponse['exchangeRate'] | null>(null);

  useEffect(() => {
    http
      .get<ExchangeRateResponse>('/api/exchange-rate')
      .then(data => setExchangeRate(data.exchangeRate))
      .catch(console.error);
  }, []);

  // 가격 변환 함수
  const convertPrice = (usdPrice: number) => {
    if (!exchangeRate || currency === 'USD') {
      return usdPrice;
    }
    return Math.round(usdPrice * exchangeRate.KRW);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  const symbol = currency === 'USD' ? '$' : '₩';

  // Context에 제공할 값
  const value = {
    currency,
    setCurrency,
    exchangeRate,
    convertPrice,
    formatPrice,
    symbol,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency는 CurrencyProvider 안에서만 사용 가능하다.');
  }

  return context;
}
