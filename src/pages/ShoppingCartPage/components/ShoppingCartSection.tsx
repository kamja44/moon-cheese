import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';
import { useCurrency } from '@/providers/CurrencyProvider';
import { useEffect, useState } from 'react';
import { http, type ProductListResponse } from '@/utils/http';
import { useCart } from '@/providers/CartProvider';
import ErrorSection from '@/components/ErrorSection';

function ShoppingCartSection() {
  const { symbol, convertPrice, formatPrice } = useCurrency();
  const { items, addItem, removeItem, getItemQuantity } = useCart();

  const [products, setProducts] = useState<ProductListResponse['products']>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get<ProductListResponse>(`/api/product/list`)
      .then(data => {
        setProducts(data.products);
      })
      .catch(err => {
        setError(err);
        console.error('상품 목록 조회 실패:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 장바구니에 담긴 상품만 필터링
  const cartProducts = products.filter(product => items.some(item => item.productId === product.id));

  // 전체 삭제
  const handleClearCart = () => {
    cartProducts.forEach(product => {
      const quantity = getItemQuantity(product.id);
      for (let i = 0; i < quantity; i++) {
        removeItem(product.id);
      }
    });
  };

  // 개별 상품 삭제 핸들러
  const handleDeleteItem = (productId: number) => {
    const quantity = getItemQuantity(productId);
    for (let i = 0; i < quantity; i++) {
      removeItem(productId);
    }
  };

  if (loading) {
    return (
      <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
        <Text variant="B2_Regular">로딩 중...</Text>
      </styled.section>
    );
  }

  if (error) {
    return (
      <styled.section bg="background.01_white">
        <Box p={5}>
          <ErrorSection onRetry={() => window.location.reload()} />
        </Box>
      </styled.section>
    );
  }

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" onClick={handleClearCart}>
          전체삭제
        </Button>
      </Flex>
      <Spacing size={4} />
      <Stack
        gap={5}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        {cartProducts.map((product, index) => {
          const quantity = getItemQuantity(product.id);
          const convertedPrice = convertPrice(product.price);

          const tagType = product.category.toLowerCase() as 'cheese' | 'cracker' | 'tea';

          return (
            <div key={product.id}>
              <ShoppingCartItem.Root>
                <ShoppingCartItem.Image src={product.images[0]} alt={product.name} />
                <ShoppingCartItem.Content>
                  <ShoppingCartItem.Info
                    type={tagType}
                    title={product.name}
                    description={product.description}
                    onDelete={() => handleDeleteItem(product.id)}
                  />
                  <ShoppingCartItem.Footer>
                    <ShoppingCartItem.Price>
                      {symbol}
                      {formatPrice(convertedPrice)}
                    </ShoppingCartItem.Price>
                    <Counter.Root>
                      <Counter.Minus onClick={() => removeItem(product.id)} disabled={quantity === 0} />
                      <Counter.Display value={quantity} />
                      <Counter.Plus onClick={() => addItem(product.id)} disabled={quantity >= product.stock} />
                    </Counter.Root>
                  </ShoppingCartItem.Footer>
                </ShoppingCartItem.Content>
              </ShoppingCartItem.Root>

              {index < cartProducts.length - 1 && <Divider color="border.01_gray" />}
            </div>
          );
        })}
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;
