import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { SECOND } from '@/constants/time';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';
import { useCart } from '@/providers/CartProvider';
import { useCurrency } from '@/providers/CurrencyProvider';
import { http } from '@/utils/http';
import type { DeliveryMethod, GradeShippingResponse, ProductListResponse, UserInfoResponse } from '@/types';

type CheckoutSectionProps = {
  selectedDeliveryMethod: DeliveryMethod;
};

function CheckoutSection({ selectedDeliveryMethod }: CheckoutSectionProps) {
  const navigate = useNavigate();

  const [products, setProducts] = useState<ProductListResponse['products']>([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [userGrade, setUserGrade] = useState<'EXPLORER' | 'PILOT' | 'COMMANDER'>('EXPLORER');
  const [gradeShippingList, setGradeShippingList] = useState<GradeShippingResponse['gradeShippingList']>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const { items, getTotalQuantity } = useCart();
  const { formatCurrency } = useCurrency();

  // 상품 목록 조회
  useEffect(() => {
    Promise.all([
      http.get<ProductListResponse>('/api/product/list'),
      http.get<UserInfoResponse>('/api/me'),
      http.get<GradeShippingResponse>('/api/grade/shipping'),
    ])
      .then(([productData, userData, shippingData]) => {
        setProducts(productData.products);
        setUserGrade(userData.grade);
        setGradeShippingList(shippingData.gradeShippingList);
      })
      .catch(error => console.error('데이터 조회 실패: ', error))
      .finally(() => setLoading(false));
  }, []);

  // 장바구니 상품 총액 계산
  const calculateItemsTotal = () => {
    return items.reduce((total, cartItem) => {
      const product = products.find(product => product.id === cartItem.productId);
      if (!product) {
        return total;
      }
      return total + product.price * cartItem.quantity;
    }, 0);
  };

  // 배송비 계산
  const calculateDeliveryFee = (itemsTotal: number) => {
    // EXPRESS = FREE
    if (selectedDeliveryMethod === 'EXPRESS') {
      return 0;
    }
    // PREMIUM
    // $30이상이면 무료
    if (itemsTotal >= 30) {
      return 0;
    }
    // $30 미만이면 등급별 배송비
    const userShippingInfo = gradeShippingList.find(info => info.type === userGrade);

    return userShippingInfo ? userShippingInfo.shippingFee : 0;
  };

  const itemsTotal = calculateItemsTotal();
  const deliveryFee = calculateDeliveryFee(itemsTotal);
  const totalPrice = itemsTotal + deliveryFee;

  const totalQuantity = getTotalQuantity();

  const onClickPurchase = async () => {
    setIsPurchasing(true);

    try {
      const purchaseData = {
        deliveryType: selectedDeliveryMethod,
        totalPrice: totalPrice,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
      // 구매 API 호출
      await http.post('/api/product/purchase', purchaseData);

      setIsPurchasing(false);
      toast.success('결제가 완료되었습니다.');
      await delay(SECOND * 2);
      navigate('/');
    } catch (error) {
      setIsPurchasing(false);
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
      console.error('결제 실패:', error);
    }
  };

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Text variant="H2_Bold">결제금액</Text>

      <Spacing size={4} />

      <Stack
        gap={6}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        <Stack gap={5}>
          <Box gap={3}>
            <Flex justify="space-between">
              <Text variant="B2_Regular">주문금액({totalQuantity}개)</Text>
              <Text variant="B2_Bold" color="state.green">
                {formatCurrency(itemsTotal)}
              </Text>
            </Flex>
            <Spacing size={3} />
            <Flex justify="space-between">
              <Text variant="B2_Regular">배송비</Text>
              <Text variant="B2_Bold">{deliveryFee === 0 ? '무료' : formatCurrency(deliveryFee)}</Text>
            </Flex>
          </Box>

          <Divider color="border.01_gray" />

          <HStack justify="space-between">
            <Text variant="H2_Bold">총 금액</Text>
            <Text variant="H2_Bold">{formatCurrency(totalPrice)}</Text>
          </HStack>
        </Stack>

        <Button fullWidth size="lg" loading={isPurchasing} onClick={onClickPurchase}>
          {isPurchasing ? '결제 중...' : '결제 진행'}
        </Button>

        <Text variant="C2_Regular" color="neutral.03_gray">
          {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
        </Text>
      </Stack>
    </styled.section>
  );
}

export default CheckoutSection;
