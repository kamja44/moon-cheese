import type { RecentProductsResponse } from '@/types';
import { http } from '@/utils/http';
import { useEffect, useState } from 'react';

type RecentProduct = RecentProductsResponse['recentProducts'][number];

export function useRecentProducts() {
  const [products, setProducts] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecentProducts = () => {
    setLoading(true);
    setError(null);

    http
      .get<RecentProductsResponse>('/api/recent/product/list')
      .then(data => {
        setProducts(data.recentProducts);
      })
      .catch(err => {
        console.error('최근 구매 상품 조회 실패:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRecentProducts();
  }, []);

  return { products, loading, error, refetch: fetchRecentProducts };
}
