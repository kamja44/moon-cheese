import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useRecentProducts } from '@/hooks/useRecentProducts';

function RecentPurchaseSection() {
  // 현재 선택된 값($,원), 환율
  const { formatCurrency } = useCurrency();
  const { products, loading, error } = useRecentProducts();

  if (loading) {
    return (
      <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
        <Text variant="H1_Bold">최근 구매한 상품</Text>
        <Spacing size={4} />
        <Text>로딩 중...</Text>
      </styled.section>
    );
  }

  if (error) {
    return (
      <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
        <Text variant="H1_Bold">최근 구매한 상품</Text>
        <Spacing size={4} />
        <Text>데이터를 불러올 수 없습니다.</Text>
      </styled.section>
    );
  }

  if (products.length === 0) {
    return (
      <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
        <Text variant="H1_Bold">최근 구매한 상품</Text>
        <Spacing size={4} />
        <Text>최근 구매한 상품이 없습니다.</Text>
      </styled.section>
    );
  }

  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      <Flex
        css={{
          bg: 'background.01_white',
          px: 5,
          py: 4,
          gap: 4,
          rounded: '2xl',
        }}
        direction={'column'}
      >
        {products.map(product => {
          return (
            <Flex
              css={{
                gap: 4,
              }}
              key={product.id}
            >
              <styled.img
                src={product.thumbnail}
                alt={product.name}
                css={{
                  w: '60px',
                  h: '60px',
                  objectFit: 'cover',
                  rounded: 'xl',
                }}
              />
              <Flex flexDir="column" gap={1}>
                <Text variant="B2_Medium">{product.name}</Text>
                <Text variant="H1_Bold">{formatCurrency(product.price)}</Text>
              </Flex>
            </Flex>
          );
        })}
      </Flex>
    </styled.section>
  );
}

export default RecentPurchaseSection;
