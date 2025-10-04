import { Spacing } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { http, type ProductDetailResponse } from '@/utils/http';
import { Box, styled } from 'styled-system/jsx';
import { Text } from '@/ui-lib';
import ErrorSection from '@/components/ErrorSection';

interface ProductProps {
  id: number;
  name: string;
  category: 'CHEESE' | 'CRACKER' | 'TEA';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
}

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // API 호출
  useEffect(() => {
    http
      .get<ProductDetailResponse>(`/api/product/${id}`)
      .then(data => setProduct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // 로딩 중
  if (loading) {
    return (
      <styled.section bg="background.01_white">
        <Box css={{ px: 5, pt: 5, pb: 4 }}>
          <Text>로딩 중...</Text>
        </Box>
      </styled.section>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <styled.section bg="background.01_white">
        <Box p={5}>
          <ErrorSection onRetry={() => window.location.reload()} />
        </Box>
      </styled.section>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <>
      <ThumbnailSection images={product.images} />
      <ProductInfoSection
        productId={product.id}
        name={product.name}
        category={product.category.toLowerCase() as 'cheese' | 'cracker' | 'tea'}
        rating={product.rating}
        price={product.price}
        quantity={product.stock}
      />

      <Spacing size={2.5} />

      <ProductDetailSection description={product.description} />

      <Spacing size={2.5} />

      <RecommendationSection productId={product.id} />
    </>
  );
}

export default ProductDetailPage;
