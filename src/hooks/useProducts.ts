import type { ProductListResponse } from '@/types';
import { http } from '@/utils/http';
import { useEffect, useState } from 'react';

export function useProducts() {
  const [products, setProducts] = useState<ProductListResponse['products']>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    http
      .get<ProductListResponse>('/api/product/list')
      .then(data => {
        setProducts(data.products);
      })
      .catch(err => {
        console.error('상품 목록 조회 실패:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
