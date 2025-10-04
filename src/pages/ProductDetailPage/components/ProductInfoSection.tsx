import { useCart } from '@/providers/CartProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { useState } from 'react';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';

type ProductInfoSectionProps = {
  productId: number;
  name: string;
  category: TagType;
  rating: number;
  price: number;
  quantity: number;
};

function ProductInfoSection({ productId, name, category, rating, price, quantity }: ProductInfoSectionProps) {
  const { formatCurrency } = useCurrency();
  const { getItemQuantity, addItem, removeItem } = useCart();
  const [localQuantity, setLocalQuantity] = useState(1);

  const cartQuantity = getItemQuantity(productId);
  const isInCart = cartQuantity > 0;

  const handleMinus = () => {
    if (localQuantity > 1) {
      setLocalQuantity(prev => prev - 1);
    }
  };
  const handlePlus = () => {
    if (localQuantity < quantity) {
      setLocalQuantity(prev => prev + 1);
    }
  };

  return (
    <styled.section css={{ bg: 'background.01_white', p: 5 }}>
      {/* 상품 정보 */}
      <Box>
        <Stack gap={2}>
          <Tag type={category} />
          <Text variant="B1_Bold">{name}</Text>
          <RatingGroup value={rating} readOnly label={`${rating.toFixed(1)}`} />
        </Stack>
        <Spacing size={4} />
        <Text variant="H1_Bold">{formatCurrency(price)}</Text>
      </Box>

      <Spacing size={5} />

      {/* 재고 및 수량 조절 */}
      <Flex justify="space-between" alignItems="center">
        <Flex alignItems="center" gap={2}>
          <Text variant="C1_Medium">재고</Text>
          <Divider orientation="vertical" color="border.01_gray" h={4} />
          <Text variant="C1_Medium" color="secondary.02_orange">
            {quantity}EA
          </Text>
        </Flex>
        <Counter.Root>
          <Counter.Minus
            onClick={event => {
              event.stopPropagation();
              handleMinus();
            }}
            disabled={localQuantity <= 1 || isInCart}
          />
          <Counter.Display value={localQuantity} />
          <Counter.Plus
            onClick={event => {
              event.stopPropagation();
              handlePlus();
            }}
            disabled={localQuantity >= quantity || isInCart}
          />
        </Counter.Root>
      </Flex>

      <Spacing size={5} />

      {/* 장바구니 버튼 */}
      {isInCart ? (
        <Button fullWidth color="primary" size="lg" onClick={() => removeItem(productId)}>
          장바구니에서 제거
        </Button>
      ) : (
        <Button
          fullWidth
          color="primary"
          size="lg"
          onClick={() => {
            for (let i = 0; i < localQuantity; i++) {
              addItem(productId);
            }
          }}
        >
          장바구니담기
        </Button>
      )}
    </styled.section>
  );
}

export default ProductInfoSection;
