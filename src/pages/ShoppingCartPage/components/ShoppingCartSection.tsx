import { Button, Counter, Spacing, Text } from '@/ui-lib';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ShoppingCartItem from './ShoppingCartItem';

function ShoppingCartSection() {
  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm">
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
        <ShoppingCartItem.Root>
          <ShoppingCartItem.Image src="/moon-cheese-images/cheese-1-1.jpg" alt="월레스의 오리지널 웬슬리데일" />
          <ShoppingCartItem.Content>
            <ShoppingCartItem.Info
              type="cheese"
              title="월레스의 오리지널 웬슬리데일"
              description="월레스의 오리지널 웬슬리데일"
              onDelete={() => {}}
            />
            <ShoppingCartItem.Footer>
              <ShoppingCartItem.Price>$12.99</ShoppingCartItem.Price>
              <Counter.Root>
                <Counter.Minus onClick={() => {}} disabled={true} />
                <Counter.Display value={1} />
                <Counter.Plus onClick={() => {}} />
              </Counter.Root>
            </ShoppingCartItem.Footer>
          </ShoppingCartItem.Content>
        </ShoppingCartItem.Root>

        <Divider color="border.01_gray" />

        <ShoppingCartItem.Root>
          <ShoppingCartItem.Image src="/moon-cheese-images/cheese-2-1.jpg" alt="월레스의 오리지널 웬슬리데일" />
          <ShoppingCartItem.Content>
            <ShoppingCartItem.Info
              type="cracker"
              title="월레스의 오리지널 웬슬리데일"
              description="월레스의 오리지널 웬슬리데일"
              onDelete={() => {}}
            />
            <ShoppingCartItem.Footer>
              <ShoppingCartItem.Price>$12.99</ShoppingCartItem.Price>
              <Counter.Root>
                <Counter.Minus onClick={() => {}} disabled={true} />
                <Counter.Display value={1} />
                <Counter.Plus onClick={() => {}} />
              </Counter.Root>
            </ShoppingCartItem.Footer>
          </ShoppingCartItem.Content>
        </ShoppingCartItem.Root>

        <Divider color="border.01_gray" />

        <ShoppingCartItem.Root>
          <ShoppingCartItem.Image src="/moon-cheese-images/cheese-3-1.jpg" alt="월레스의 오리지널 웬슬리데일" />
          <ShoppingCartItem.Content>
            <ShoppingCartItem.Info
              type="tea"
              title="월레스의 오리지널 웬슬리데일"
              description="월레스의 오리지널 웬슬리데일"
              onDelete={() => {}}
            />
            <ShoppingCartItem.Footer>
              <ShoppingCartItem.Price>$12.99</ShoppingCartItem.Price>
              <Counter.Root>
                <Counter.Minus onClick={() => {}} disabled={true} />
                <Counter.Display value={1} />
                <Counter.Plus onClick={() => {}} />
              </Counter.Root>
            </ShoppingCartItem.Footer>
          </ShoppingCartItem.Content>
        </ShoppingCartItem.Root>
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;
