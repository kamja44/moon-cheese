import { Spacing, Text } from '@/ui-lib';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import { useEffect, useState } from 'react';
import { http, type ProductsResponse, type RecommendedProductsResponse } from '@/utils/http';
import { useCurrency } from '@/providers/CurrencyProvider';
import ErrorSection from '@/components/ErrorSection';

type RecommendationSectionProps = {
  productId: number;
};

function RecommendationSection({ productId }: RecommendationSectionProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<ProductsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { symbol, convertPrice, formatPrice } = useCurrency();
  useEffect(() => {
    http
      .get<RecommendedProductsResponse>(`/api/product/recommend/${productId}`)
      .then(data => {
        const recommendIds = data.recommendProductIds;

        // 전체 상품 목록 가져오기
        return http.get<{ products: ProductsResponse[] }>(`/api/product/list`).then(productData => {
          // 추천 ID에 해당하는 상품 필터링
          const filtered = productData.products.filter(product => recommendIds.includes(product.id));
          setRecommendedProducts(filtered);
        });
      })
      .catch(err => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // 로딩 중
  if (loading) {
    return (
      <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
        <Text variant="H2_Bold">추천 제품</Text>
        <Spacing size={4} />
        <Text>로딩 중...</Text>
      </styled.section>
    );
  }

  if (error) {
    return (
      <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
        <Text variant="H2_Bold">추천 제품</Text>
        <Spacing size={4} />
        <ErrorSection onRetry={() => window.location.reload()} />
      </styled.section>
    );
  }

  // 추천 상품 없음
  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {recommendedProducts.map(recommendedProduct => {
          const price = convertPrice(recommendedProduct.price);

          return (
            <RecommendationProductItem.Root
              key={recommendedProduct.id}
              onClick={() => handleClickProduct(recommendedProduct.id)}
            >
              <RecommendationProductItem.Image src={recommendedProduct.images[0]} alt={recommendedProduct.name} />
              <RecommendationProductItem.Info name={recommendedProduct.name} rating={recommendedProduct.rating} />
              <RecommendationProductItem.Price>
                {symbol}
                {formatPrice(price)}
              </RecommendationProductItem.Price>
            </RecommendationProductItem.Root>
          );
        })}
      </HStack>
    </styled.section>
  );
}

export default RecommendationSection;
