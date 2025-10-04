import type { FreeTagType } from '@/types';

type ProductWithFreeInfo = {
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
};

/**
 * 상품의 FreeTag 타입을 결정합니다.
 * @param product - 상품 정보
 * @returns FreeTag 타입 또는 undefined
 */
export function getFreeTagType(product: ProductWithFreeInfo): FreeTagType | undefined {
  if (product.isGlutenFree) {
    return 'gluten';
  }
  if (product.isCaffeineFree) {
    return 'caffeine';
  }
  return undefined;
}
