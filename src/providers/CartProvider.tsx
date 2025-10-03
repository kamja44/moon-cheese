import { createContext, useContext, useState, type ReactNode } from 'react';

type CartItem = {
  productId: number; // 어떤 상품인지
  quantity: number; // 몇 개를 담았는지
};

type CartContextType = {
  items: CartItem[]; // 장바구니 목록
  addItem: (productId: number) => void; // 추가
  removeItem: (productId: number) => void; // 제거
  getItemQuantity: (productId: number) => number; // 특정 상품의 수량
  getTotalQuantity: () => number; // 총 수량
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 상품 추가
  const addItem = (productId: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);

      if (existingItem) {
        // 이미 존재하면 수량 + 1
        return prev.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        // 없으면 새로 추가
        return [
          ...prev,
          {
            productId,
            quantity: 1,
          },
        ];
      }
    });
  };

  // 상품 제거
  const removeItem = (productId: number) => {
    setItems(prev => {
      const existingItem = prev.find(prev => prev.productId === productId);

      if (!existingItem) {
        return prev;
      }

      if (existingItem.quantity === 1) {
        // 수량이 1이면 아이템 제거
        return prev.filter(item => item.productId !== productId);
      } else {
        // 수량이 2개 이상일 때
        return prev.map(item =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        );
      }
    });
  };

  // 특정 상품의 수량 조회
  const getItemQuantity = (productId: number): number => {
    const item = items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  // 전체 상품의 수량 조회
  const getTotalQuantity = (): number => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items,
    addItem,
    removeItem,
    getItemQuantity,
    getTotalQuantity,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart는 CartProvider안에서만 사용 가능');
  }
  return context;
}
