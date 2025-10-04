// 환율 API
export interface ExchangeRateResponse {
  exchangeRate: {
    KRW: number;
    USD: number;
  };
}

// 사용자 정보 API
export interface UserInfoResponse {
  point: number;
  grade: 'EXPLORER' | 'PILOT' | 'COMMANDER';
}

// 등급 포인트 API
export interface GradePointResponse {
  gradePointList: {
    type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
    minPoint: number;
  }[];
}

// 등급별 배송비 API
export interface GradeShippingResponse {
  gradeShippingList: {
    type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
    shippingFee: number;
    freeShippingThreshold: number;
  }[];
}

// 최근 구매 상품 API
export interface RecentProductsResponse {
  recentProducts: {
    id: number;
    thumbnail: string;
    name: string;
    price: number;
  }[];
}

// 개별 상품 타입
export interface ProductsResponse {
  id: number;
  name: string;
  category: 'CHEESE' | 'CRACKER' | 'TEA';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
}

// 상품 목록 API
export interface ProductListResponse {
  products: {
    id: number;
    name: string;
    category: 'CHEESE' | 'CRACKER' | 'TEA';
    stock: number;
    price: number;
    description: string;
    detailDescription: string;
    images: string[];
    rating: number;
    isGlutenFree?: boolean;
    isCaffeineFree?: boolean;
  }[];
}

// 상품 상세 API
export interface ProductDetailResponse {
  id: number;
  name: string;
  category: 'CHEESE' | 'CRACKER' | 'TEA';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
  isCaffeineFree?: boolean;
}

// 추천 상품 API
export interface RecommendedProductsResponse {
  recommendProductIds: number[];
}
