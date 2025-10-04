import Axios from 'axios';
const axios = Axios.create();

export interface ExchangeRateResponse {
  exchangeRate: {
    KRW: number;
    USD: number;
  };
}

export interface UserInfoResponse {
  point: number;
  grade: 'EXPLORER' | 'PILOT' | 'COMMANDER';
}

export interface GradePointResponse {
  gradePointList: {
    type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
    minPoint: number;
  }[];
}

export interface RecentProductsResponse {
  recentProducts: {
    id: number;
    thumbnail: string;
    name: string;
    price: number;
  }[];
}

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

export interface RecommendedProductsResponse {
  recommendProductIds: number[];
}

export interface GradeShippingResponse {
  gradeShippingList: {
    type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
    shippingFee: number;
    freeShippingThreshold: number;
  }[];
}

export const http = {
  get: function get<Response = unknown>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
  },
  post: function post<Request = any, Response = unknown>(url: string, data?: Request) {
    return axios.post<Response>(url, { data }).then(res => res.data);
  },
};
