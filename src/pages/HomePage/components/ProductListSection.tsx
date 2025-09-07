import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value)}>
        <SubGNB.List>
          <SubGNB.Trigger value="all">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="cheese">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="cracker">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="tea">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        <ProductItem.Root onClick={() => handleClickProduct(1)}>
          <ProductItem.Image src="/moon-cheese-images/cheese-1-1.jpg" alt="월레스의 오리지널 웬슬리데일" />
          <ProductItem.Info title="월레스의 오리지널 웬슬리데일" description="월레스가 아침마다 찾는 바로 그 치즈!" />
          <ProductItem.Meta>
            <ProductItem.MetaLeft>
              <ProductItem.Rating rating={4} />
              <ProductItem.Price>$12.99</ProductItem.Price>
            </ProductItem.MetaLeft>
          </ProductItem.Meta>
          <Counter.Root>
            <Counter.Minus onClick={() => {}} disabled={true} />
            <Counter.Display value={3} />
            <Counter.Plus onClick={() => {}} />
          </Counter.Root>
        </ProductItem.Root>

        <ProductItem.Root onClick={() => handleClickProduct(2)}>
          <ProductItem.Image src="/moon-cheese-images/cracker-1-1.jpg" alt="로봇 크런치 비스킷" />
          <ProductItem.Info title="로봇 크런치 비스킷" description="로봇 캐릭터 모양의 귀리 비스킷" />
          <ProductItem.Meta>
            <ProductItem.MetaLeft>
              <ProductItem.Rating rating={3} />
              <ProductItem.Price>5.00</ProductItem.Price>
            </ProductItem.MetaLeft>
            <ProductItem.FreeTag type="gluten" />
          </ProductItem.Meta>
          <Counter.Root>
            <Counter.Minus onClick={() => {}} disabled={true} />
            <Counter.Display value={3} />
            <Counter.Plus onClick={() => {}} />
          </Counter.Root>
        </ProductItem.Root>

        <ProductItem.Root onClick={() => handleClickProduct(3)}>
          <ProductItem.Image src="/moon-cheese-images/tea-1-1.jpg" alt="문라이트 카모마일 티" />
          <ProductItem.Info title="문라이트 카모마일 티" description="달빛 같은 부드러운 허브차" />
          <ProductItem.Meta>
            <ProductItem.MetaLeft>
              <ProductItem.Rating rating={5} />
              <ProductItem.Price>$7.00</ProductItem.Price>
            </ProductItem.MetaLeft>
            <ProductItem.FreeTag type="caffeine" />
          </ProductItem.Meta>
          <Counter.Root>
            <Counter.Minus onClick={() => {}} disabled={true} />
            <Counter.Display value={3} />
            <Counter.Plus onClick={() => {}} />
          </Counter.Root>
        </ProductItem.Root>
      </Grid>
    </styled.section>
  );
}

export default ProductListSection;
