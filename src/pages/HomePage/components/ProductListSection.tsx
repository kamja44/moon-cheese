import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useCart } from '@/providers/CartProvider';
import ErrorSection from '@/components/ErrorSection';
import { useProducts } from '@/hooks/useProducts';
import { getFreeTagType } from '@/utils/product';

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState('all');

  const { formatCurrency } = useCurrency();
  const { addItem, removeItem, getItemQuantity } = useCart();
  const { products, loading, error, refetch } = useProducts();
  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    if (currentTab === 'all') {
      return true;
    }
    return product.category.toLowerCase() === currentTab;
  });

  // 로딩 중
  if (loading) {
    return (
      <styled.section bg="background.01_white">
        <Box css={{ px: 5, pt: 5, pb: 4 }}>
          <Text variant="H1_Bold">판매중인 상품</Text>
        </Box>
        <Box p={5}>
          <Text>로딩 중...</Text>
        </Box>
      </styled.section>
    );
  }

  // 에러 발생
  if (error) {
    return (
      <styled.section bg="background.01_white">
        <Box css={{ px: 5, pt: 5, pb: 4 }}>
          <Text variant="H1_Bold">판매중인 상품</Text>
        </Box>
        <Box p={5}>
          <ErrorSection onRetry={refetch} />
        </Box>
      </styled.section>
    );
  }

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
        {filteredProducts.map(product => {
          const quantity = getItemQuantity(product.id);
          const freeTagType = getFreeTagType(product);
          return (
            <ProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
              <ProductItem.Image src={product.images[0]} alt={product.name} />
              <ProductItem.Info title={product.name} description={product.description} />
              <ProductItem.Meta>
                <ProductItem.MetaLeft>
                  <ProductItem.Rating rating={product.rating} />
                  <ProductItem.Price>{formatCurrency(product.price)}</ProductItem.Price>
                </ProductItem.MetaLeft>
                {freeTagType && <ProductItem.FreeTag type={freeTagType} />}
              </ProductItem.Meta>
              <Counter.Root>
                <Counter.Minus
                  onClick={event => {
                    event.stopPropagation();
                    removeItem(product.id);
                  }}
                  disabled={quantity === 0}
                />
                <Counter.Display value={quantity} />
                <Counter.Plus
                  onClick={event => {
                    event.stopPropagation();
                    addItem(product.id);
                  }}
                  disabled={quantity >= product.stock}
                />
              </Counter.Root>
            </ProductItem.Root>
          );
        })}
      </Grid>
    </styled.section>
  );
}

export default ProductListSection;
