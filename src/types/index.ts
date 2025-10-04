// src/types/index.ts
import type { ProductListResponse, RecentProductsResponse, GradePointResponse } from './api';

// 상품 타입
export type Product = ProductListResponse['products'][number];

// 최근 구매 상품 타입
export type RecentProduct = RecentProductsResponse['recentProducts'][number];

// 등급 포인트 타입
export type GradePoint = GradePointResponse['gradePointList'][number];

// 등급 타입
export type GradeType = 'EXPLORER' | 'PILOT' | 'COMMANDER';

// 배송 방식 타입
export type DeliveryMethod = 'EXPRESS' | 'PREMIUM';

// 통화 타입
export type Currency = 'USD' | 'KRW';

// 태그 타입
export type TagType = 'cheese' | 'cracker' | 'tea';

// FreeTag 타입
export type FreeTagType = 'milk' | 'caffeine' | 'gluten';

// API 타입도 재export (편의성)
export * from './api';
