import { Spacing, Text } from '@/ui-lib';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';

function RecommendationSection() {
  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        <RecommendationProductItem.Root onClick={() => handleClickProduct(1)}>
          <RecommendationProductItem.Image
            src="/moon-cheese-images/cheese-1-1.jpg"
            alt="월레스의 오리지널 웬슬리데일"
          />
          <RecommendationProductItem.Info name="월레스의 오리지널 웬슬리데일" rating={4.0} />
          <RecommendationProductItem.Price>$12.99</RecommendationProductItem.Price>
        </RecommendationProductItem.Root>

        <RecommendationProductItem.Root onClick={() => handleClickProduct(2)}>
          <RecommendationProductItem.Image
            src="/moon-cheese-images/tea-1-1.jpg"
            alt="그로밋의 잉글리쉬 브렉퍼스트 티"
          />
          <RecommendationProductItem.Info name="그로밋의 잉글리쉬 브렉퍼스트 티" rating={4.0} />
          <RecommendationProductItem.Price>$6.75</RecommendationProductItem.Price>
        </RecommendationProductItem.Root>

        <RecommendationProductItem.Root onClick={() => handleClickProduct(3)}>
          <RecommendationProductItem.Image src="/moon-cheese-images/cheese-3-1.jpg" alt="크래이머 블루 치즈" />
          <RecommendationProductItem.Info name="크래이머 블루 치즈" rating={4.0} />
          <RecommendationProductItem.Price>$15.75</RecommendationProductItem.Price>
        </RecommendationProductItem.Root>
      </HStack>
    </styled.section>
  );
}

export default RecommendationSection;
