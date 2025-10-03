# 🧀 Moon Cheese 프로젝트 TIL

> React Context API, 전역 상태 관리, 비동기 처리, 이벤트 처리 학습 기록

---

## 📅 학습 날짜
2025-10-03 ~ 2025-10-04

---

## 📖 목차

- [Chapter 1: 전역 상태 관리와 API 연동](#chapter-1-전역-상태-관리와-api-연동)
- [Chapter 2: 장바구니 시스템과 이벤트 처리](#chapter-2-장바구니-시스템과-이벤트-처리)

---

# Chapter 1: 전역 상태 관리와 API 연동

## 🎯 구현한 기능 (1차 이터레이션)

1. ✅ 환율 정보를 서버에서 불러와 전역 상태로 관리
2. ✅ 통화 선택 기능 (USD ↔ KRW)
3. ✅ 등급 시스템 및 진행바 시각화
4. ✅ 에러 처리 및 사용자 피드백
5. ✅ 최근 구매 상품 목록

---

## 📚 학습 내용

### 1️⃣ React Context API - 전역 상태 관리

#### ❓ Context가 뭐야?

Props를 여러 단계로 내려주지 않고, **어디서든 접근 가능한 전역 상태**를 만드는 방법!

```
          App
           │
    ┌──────┴──────┐
    │             │
  Header      HomePage
 (통화 선택)      │
            ┌────┴────┐
            │         │
     ProductList  RecentPurchase
            │         │
       ProductItem  (가격 표시)
       (가격 표시)
```

**Props 방식:**
```
App → HomePage → ProductList → ProductItem (3단계!)
```

**Context 방식:**
```
Header와 ProductItem 둘 다 직접 접근! ✨
```

---

#### 🔧 Context 만드는 3단계

**1단계: Context 생성**
```typescript
import { createContext } from 'react';

type CurrencyContextType = {
  currency: 'USD' | 'KRW';
  setCurrency: (currency: 'USD' | 'KRW') => void;
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);
```

**2단계: Provider 만들기**
```typescript
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<'USD' | 'KRW'>('USD');

  const value = {
    currency,
    setCurrency,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}
```

**3단계: 커스텀 Hook 만들기**
```typescript
export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error('useCurrency는 CurrencyProvider 안에서만 사용 가능!');
  }

  return context;
}
```

---

#### 💡 useContext는 뭐하는 애야?

`useContext`는 Context의 **현재 값을 읽어오는** Hook이에요.

```typescript
const context = useContext(CurrencyContext);
```

**동작 방식:**

```
Provider 있을 때:  ✅ { currency: 'USD', setCurrency: ... } 반환
Provider 없을 때:  ❌ null 반환 (createContext(null)의 초기값)
```

**중요!** `useContext` 자체는 에러를 안 던져요!

```typescript
// ❌ useContext는 에러를 던지지 않음
const context = useContext(CurrencyContext); // null 가능

// ✅ 우리가 직접 체크해서 에러를 던져야 함!
if (!context) {
  throw new Error('Provider 안에서 사용하세요!');
}
```

**왜 null 체크를 하나요?**
1. 타입 안전성 (TypeScript가 null이 아님을 보장)
2. 명확한 에러 메시지
3. 개발자 경험 향상

---

### 2️⃣ Promise.all - 병렬 API 호출

#### ❓ Promise.all이 뭐야?

**여러 개의 비동기 작업을 동시에** 실행하고, 모두 완료될 때까지 기다리는 방법!

```
일반적인 방식 (순차 실행):
┌─────────┐
│ API 1   │ ───► 2초
└─────────┘
           ┌─────────┐
           │ API 2   │ ───► 2초
           └─────────┘
                      총 4초! 😰

Promise.all (병렬 실행):
┌─────────┐
│ API 1   │ ───► 2초
└─────────┘
┌─────────┐
│ API 2   │ ───► 2초
└─────────┘
           총 2초! 🎉
```

---

#### 🔧 사용 방법

**순차 실행 (느림):**
```typescript
// ❌ 하나씩 기다림 (총 4초)
const user = await http.get('/api/me');          // 2초
const grades = await http.get('/api/grade/point'); // 2초
```

**병렬 실행 (빠름):**
```typescript
// ✅ 동시에 실행 (총 2초)
const [user, grades] = await Promise.all([
  http.get('/api/me'),
  http.get('/api/grade/point'),
]);
```

---

#### 📝 실제 사용 예시

```typescript
useEffect(() => {
  Promise.all([
    http.get<UserInfoResponse>('/api/me'),
    http.get<GradePointResponse>('/api/grade/point'),
  ])
    .then(([user, grades]) => {
      // 두 API가 모두 성공하면 실행
      setUserInfo(user);
      setGradePoints(grades.gradePointList);
    })
    .catch(err => {
      // 하나라도 실패하면 에러 처리
      setError(err);
    })
    .finally(() => {
      // 성공/실패와 관계없이 실행
      setLoading(false);
    });
}, []);
```

---

#### ⚠️ 주의사항

**하나라도 실패하면 전체 실패!**

```typescript
Promise.all([
  http.get('/api/success'),  // ✅ 성공
  http.get('/api/fail'),     // ❌ 실패
  http.get('/api/success'),  // ✅ 성공
])
  .then(results => {
    // 여기 안 옴!
  })
  .catch(err => {
    // 여기로 옴! 하나라도 실패하면 catch
  });
```

**개별 에러 처리가 필요하면?**
```typescript
const [user, grades] = await Promise.allSettled([
  http.get('/api/me'),
  http.get('/api/grade/point'),
]);

// user.status === 'fulfilled' 또는 'rejected'
// grades.status === 'fulfilled' 또는 'rejected'
```

---

### 3️⃣ TypeScript 타입 정의 패턴

#### 🎨 API 응답 타입 관리

**Before (함수마다 타입 생성):**
```typescript
// ❌ 코드가 길어짐
export const http = {
  exchange: function exchange<Response = ExchangeProps>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
  },
  getMe: function getMe<Response = getMeProps>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
  },
  getGradePoint: function getGradePoint<Response = GradePointProps>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
  },
};
```

**After (타입만 export):**
```typescript
// ✅ 간결하고 재사용 가능!
export interface ExchangeRateResponse {
  exchangeRate: { KRW: number; USD: number; };
}

export interface UserInfoResponse {
  point: number;
  grade: 'EXPLORER' | 'PILOT' | 'COMMANDER';
}

export const http = {
  get: function get<Response = unknown>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
  },
};

// 사용
http.get<ExchangeRateResponse>('/api/exchange-rate');
http.get<UserInfoResponse>('/api/me');
```

---

### 4️⃣ 상태 관리 패턴

#### 📊 로딩 / 에러 / 데이터 상태

**3가지 상태를 항상 관리하자!**

```typescript
const [data, setData] = useState<Data | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  http.get('/api/data')
    .then(result => setData(result))
    .catch(err => setError(err))
    .finally(() => setLoading(false));
}, []);

// 1. 로딩 중
if (loading) return <div>로딩 중...</div>;

// 2. 에러 발생
if (error) return <ErrorSection />;

// 3. 데이터 표시
return <div>{data.content}</div>;
```

---

#### 🎯 상태 흐름도

```
        useEffect 실행
             │
             ├─► http.get() 호출
             │       │
             │   ┌───┴────┐
             │   │        │
             │  성공     실패
             │   │        │
             ├──►│        │◄────┐
             │   │        │     │
         setData  setError      │
             │   │        │     │
             └───┴────────┴─────┘
                      │
                 setLoading(false)
                      │
                  렌더링
```

---

### 5️⃣ SOLID 원칙과 의존성 관리

#### 🤔 현재 코드가 SOLID 원칙에 위배되나?

**현재 http.ts 코드:**
```typescript
export const http = {
  get: function get<Response = unknown>(url: string) {
    return axios.get<Response>(url).then(res => res.data);
    //     ^^^^^ axios에 직접 의존!
  },
};
```

**분석 결과:**
- ✅ **SRP** (단일 책임): OK - HTTP GET 요청만 담당
- ✅ **OCP** (개방-폐쇄): OK - 제네릭으로 확장 가능
- ✅ **ISP** (인터페이스 분리): OK - 필요한 메서드만 제공
- ⚠️ **DIP** (의존성 역전): **약간 위배** - axios 구체 클래스에 직접 의존

---

#### ⚠️ 문제: 의존성 역전 원칙(DIP) 위배

```
현재 구조:
┌─────────────┐
│ http.get()  │
└──────┬──────┘
       │ (직접 의존)
       ▼
┌─────────────┐
│   axios     │ ◄─── 구체적인 구현!
└─────────────┘

문제점:
• axios를 fetch로 바꾸려면 모든 코드 수정 필요
• 테스트 시 axios 모킹 필수
• 확장성 낮음
```

---

#### ✅ 해결 방법들

**방법 1: 의존성 주입 (DI) - 엔터프라이즈급**

```typescript
// 1. 인터페이스 정의 (추상화)
interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T, D>(url: string, data?: D): Promise<T>;
}

// 2. Axios 구현체
class AxiosHttpClient implements HttpClient {
  private client = Axios.create();

  get<T>(url: string): Promise<T> {
    return this.client.get<T>(url).then(res => res.data);
  }

  post<T, D>(url: string, data?: D): Promise<T> {
    return this.client.post<T>(url, { data }).then(res => res.data);
  }
}

// 3. Fetch 구현체 (언제든 교체 가능!)
class FetchHttpClient implements HttpClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url);
    return response.json();
  }

  async post<T, D>(url: string, data?: D): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return response.json();
  }
}

// 4. 사용
export const http: HttpClient = new AxiosHttpClient();
// 나중에 교체: export const http: HttpClient = new FetchHttpClient();
```

**구조:**
```
┌─────────────┐
│ http.get()  │
└──────┬──────┘
       │ (인터페이스 의존)
       ▼
┌──────────────────┐
│  HttpClient      │ ◄─── 추상화!
│  (interface)     │
└──────┬───────────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐
│AxiosClient  │ │FetchClient│ │MockClient│
└─────────────┘ └──────────┘ └──────────┘
   (구현체들 - 자유롭게 교체 가능!)
```

---

**방법 2: 어댑터 패턴**

```typescript
// 추상화 계층
interface ApiClient {
  request<T>(config: RequestConfig): Promise<T>;
}

// Axios 어댑터
class AxiosAdapter implements ApiClient {
  private axios = Axios.create();

  async request<T>(config: RequestConfig): Promise<T> {
    const response = await this.axios.request(config);
    return response.data;
  }
}

// HTTP 서비스 (추상화에 의존)
class HttpService {
  constructor(private client: ApiClient) {}

  get<T>(url: string): Promise<T> {
    return this.client.request<T>({ method: 'GET', url });
  }

  post<T, D>(url: string, data?: D): Promise<T> {
    return this.client.request<T>({ method: 'POST', url, data });
  }
}

export const http = new HttpService(new AxiosAdapter());
```

---

**방법 3: 현실적인 절충안 (추천!)**

```typescript
// 타입만 분리 (테스트 가능 + 간단함)
interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T, D>(url: string, data?: D): Promise<T>;
}

const createHttpClient = (): HttpClient => {
  const axios = Axios.create();

  return {
    get<T>(url: string) {
      return axios.get<T>(url).then(res => res.data);
    },
    post<T, D>(url: string, data?: D) {
      return axios.post<T>(url, { data }).then(res => res.data);
    },
  };
};

export const http = createHttpClient();

// 테스트에서는 Mock 주입 가능!
export const createMockHttpClient = (): HttpClient => ({
  get: jest.fn(),
  post: jest.fn(),
});
```

---

#### 🎯 언제 어떤 방법을 쓸까?

```
┌─────────────────────────────────────────┐
│        작은 프로젝트                      │
│  (Moon Cheese 같은 학습 프로젝트)         │
├─────────────────────────────────────────┤
│  ✅ 현재 방식 OK                         │
│  • 간단하고 빠름                         │
│  • 과도한 추상화 = 오버 엔지니어링        │
│  • axios 바꿀 일 거의 없음               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        중간 프로젝트                     │
│  (스타트업, 중소 규모)                   │
├─────────────────────────────────────────┤
│  ✅ 방법 3 (절충안)                      │
│  • 인터페이스로 추상화                   │
│  • 테스트 모킹 가능                      │
│  • 코드는 간단하게 유지                  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│        큰 프로젝트                       │
│  (엔터프라이즈, 대규모 팀)               │
├─────────────────────────────────────────┤
│  ✅ 방법 1 또는 2 (DI/어댑터)            │
│  • 완전한 의존성 역전                    │
│  • 여러 HTTP 클라이언트 지원             │
│  • 높은 확장성                          │
│  • 팀 협업에 유리                       │
└─────────────────────────────────────────┘
```

---

#### 💡 핵심 교훈

> **"좋은 코드 = 적절한 추상화 레벨"**

**과소 추상화:**
```typescript
// ❌ 모든 곳에서 axios 직접 사용
axios.get('/api/me').then(res => setUser(res.data));
axios.get('/api/products').then(res => setProducts(res.data));
// 중복 코드, 에러 처리 누락, 일관성 없음
```

**적절한 추상화:**
```typescript
// ✅ http.get으로 일관성 있게 사용
http.get<UserInfo>('/api/me').then(setUser);
http.get<Products>('/api/products').then(setProducts);
// 깔끔, 타입 안전, 에러 처리 일관
```

**과도한 추상화:**
```typescript
// ❌ 작은 프로젝트에 너무 복잡한 구조
class HttpClientFactory {
  createClient(type: 'axios' | 'fetch'): IHttpClient {
    return this.container.resolve(type);
  }
}
// 오버 엔지니어링, 유지보수 복잡
```

---

#### 📊 비교표

| 구분 | 현재 방식 | 절충안 (방법 3) | DI/어댑터 (방법 1,2) |
|------|-----------|----------------|---------------------|
| **코드 복잡도** | ⭐ 매우 간단 | ⭐⭐ 간단 | ⭐⭐⭐⭐ 복잡 |
| **테스트 용이성** | ⚠️ 어려움 | ✅ 쉬움 | ✅ 매우 쉬움 |
| **확장성** | ⚠️ 낮음 | ✅ 중간 | ✅ 매우 높음 |
| **SOLID 준수** | ⚠️ DIP 위배 | ✅ 대부분 준수 | ✅ 완벽 준수 |
| **학습 곡선** | ⭐ 쉬움 | ⭐⭐ 보통 | ⭐⭐⭐⭐ 어려움 |
| **적합한 프로젝트** | 학습, 소규모 | 스타트업, 중소 | 엔터프라이즈 |

---

#### 🎓 결론

**Q: 현재 코드가 잘못됐나요?**
- **NO!** 작은 프로젝트에서는 실용적인 선택

**Q: SOLID 원칙을 항상 지켜야 하나요?**
- **NO!** 상황에 맞게 적절한 수준으로

**Q: 언제 리팩토링해야 하나요?**
- 프로젝트가 커질 때
- 테스트가 중요해질 때
- 여러 HTTP 클라이언트 지원이 필요할 때
- 팀 규모가 커질 때

**핵심:**
```
작은 프로젝트: 간단하게 → 빠른 개발
큰 프로젝트: 추상화 → 유지보수성

"필요할 때 리팩토링하자!"
```

---

### 6️⃣ 실전 꿀팁 🍯

#### 1. 환율 계산 & 포맷팅

```typescript
// 가격 변환 (USD → KRW)
const convertPrice = (usdPrice: number) => {
  if (currency === 'USD') return usdPrice;
  // 원화는 반올림!
  return Math.round(usdPrice * exchangeRate.KRW);
};

// 콤마 추가
const formatPrice = (price: number) => {
  return price.toLocaleString();
  // 12345 → "12,345"
};

// 사용
const price = convertPrice(12.99);      // 15588 (KRW)
const formatted = formatPrice(price);   // "15,588"
```

---

#### 2. 진행률 계산

```typescript
// 현재 포인트: 5P
// PILOT 시작: 3.5P
// COMMANDER 시작: 7P

const progress = (5 - 3.5) / (7 - 3.5);
// = 1.5 / 3.5
// = 0.428 (42.8%)

<ProgressBar value={progress} />
```

---

#### 3. 배열 필터링

```typescript
// 탭에 따라 상품 필터링
const filteredProducts = products.filter(product => {
  if (currentTab === 'all') return true;
  return product.category.toLowerCase() === currentTab;
});
```

---

## 🎨 아키텍처 다이어그램

### 전역 상태 흐름

```
┌─────────────────────────────────────────────────┐
│                   App.tsx                       │
│  ┌───────────────────────────────────────────┐  │
│  │         GlobalProvider                    │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      CurrencyProvider               │  │  │
│  │  │                                     │  │  │
│  │  │  State:                             │  │  │
│  │  │  • currency: 'USD' | 'KRW'          │  │  │
│  │  │  • exchangeRate: { KRW, USD }       │  │  │
│  │  │                                     │  │  │
│  │  │  Functions:                         │  │  │
│  │  │  • convertPrice()                   │  │  │
│  │  │  • formatPrice()                    │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
    ┌─────▼─────┐         ┌──────▼──────┐
    │  Header   │         │  HomePage   │
    │           │         │             │
    │ • Toggle  │         │ • ProductList
    │ • 통화 선택 │         │ • RecentPurchase
    └───────────┘         │ • CurrentLevel
                          └─────────────┘
                                  │
                      useCurrency() ◄─── Context 접근!
                                  │
                          ┌───────┴───────┐
                          │               │
                     convertPrice    formatPrice
                          │               │
                      "15,588원"      "$12.99"
```

---

### API 호출 플로우

```
┌──────────────┐
│ Component    │
│  useEffect   │
└──────┬───────┘
       │
       ├─► Promise.all([
       │     http.get('/api/me'),
       │     http.get('/api/grade/point')
       │   ])
       │
   ┌───┴────┐
   │  MSW   │ (Mock Service Worker)
   │ Server │
   └───┬────┘
       │
   ┌───┴────────┐
   │  33% 확률  │
   ├────┬───────┤
   │    │       │
  성공  실패   성공
   │    │       │
   │   500     200
   │  Error   Data
   │    │       │
   └────┼───────┘
        │
    ┌───┴────┐
    │ .then  │ ──► setData()
    │ .catch │ ──► setError()
    │.finally│ ──► setLoading(false)
    └────────┘
```

---

## 🐛 트러블슈팅

### 문제 1: `grades.gradePointList` 속성이 없다는 에러

**에러 메시지:**
```
'GradePoint[]' 형식에 'gradePointList' 속성이 없습니다.
```

**원인:**
타입을 잘못 지정함
```typescript
// ❌ 잘못된 타입
const [gradePoints, setGradePoints] = useState<GradePointResponse[]>([]);
http.get<GradePoint[]>('/api/grade/point')
```

**해결:**
```typescript
// ✅ 올바른 타입
const [gradePoints, setGradePoints] = useState<GradePoint[]>([]);
http.get<GradePointResponse>('/api/grade/point')
  .then(([user, grades]) => {
    setGradePoints(grades.gradePointList); // 이제 동작!
  });
```

---

### 문제 2: 타입이 객체인지 배열인지 헷갈림

**서버 응답 구조 확인 필요!**

```typescript
// handlers.ts 확인
return HttpResponse.json(
  { gradePointList },  // ← 객체 안에 배열!
  { status: 200 }
);

// data.ts 확인
export const gradePointList = [
  { type: 'EXPLORER', minPoint: 0 },
  { type: 'PILOT', minPoint: 3.5 },
  { type: 'COMMANDER', minPoint: 7 }
];
```

**타입 정의:**
```typescript
export interface GradePointResponse {
  gradePointList: {  // ← 객체 안에
    type: 'EXPLORER' | 'PILOT' | 'COMMANDER';
    minPoint: number;
  }[];  // ← 배열!
}
```

---

## 💡 핵심 개념 정리

### Context API
- **목적:** Props drilling 없이 전역 상태 관리
- **구성:** createContext → Provider → useContext
- **장점:** 코드 간결, 유지보수 쉬움
- **주의:** null 체크 필수!

### Promise.all
- **목적:** 병렬 API 호출로 성능 향상
- **사용법:** `Promise.all([api1, api2])`
- **장점:** 빠른 응답 속도
- **주의:** 하나라도 실패하면 전체 실패

### 상태 관리
- **3가지 상태:** loading, error, data
- **패턴:** try-catch-finally 또는 then-catch-finally
- **UI:** 각 상태에 맞는 화면 표시

---

## 🎓 배운 점

1. **Context는 전역 상태 관리의 기본!**
   - useState만으로 부족할 때 사용
   - Provider로 감싸는 것 잊지 말기

2. **Promise.all로 성능 최적화!**
   - 독립적인 API는 병렬로 호출
   - 순차 실행보다 훨씬 빠름

3. **타입 정의는 서버 응답 구조를 정확히 확인하자!**
   - handlers.ts, data.ts 확인 필수
   - 객체인지 배열인지 명확히

4. **에러 처리는 사용자 경험의 핵심!**
   - 로딩, 에러, 성공 모두 처리
   - 명확한 메시지와 재시도 기능

5. **작은 함수로 분리하면 재사용성 UP!**
   - convertPrice, formatPrice
   - 한 가지 일만 하는 함수가 좋은 함수

---

## 📌 Chapter 1 요약

- ✅ Context API로 전역 상태 관리
- ✅ Promise.all로 병렬 API 호출
- ✅ 타입 안전성 확보
- ✅ 에러 처리 패턴 학습
- ✅ SOLID 원칙 이해

---

# Chapter 2: 장바구니 시스템과 이벤트 처리

## 🎯 구현한 기능 (2차 이터레이션)

1. ✅ 상품 목록 API 연동 및 카테고리 필터링
2. ✅ 장바구니 전역 상태 관리 (CartProvider)
3. ✅ Counter 컴포넌트로 수량 조절
4. ✅ 재고/수량 기반 버튼 비활성화
5. ✅ Header 장바구니 뱃지 실시간 업데이트
6. ✅ 이벤트 버블링 제어 (stopPropagation)
7. ✅ 카테고리별 태그 표시 (글루텐/카페인 프리)

---

## 📚 학습 내용

### 1️⃣ 장바구니 Context 설계

#### ❓ 장바구니는 어떤 데이터를 관리해야 할까?

**요구사항 분석:**
- 어떤 상품을 담았는지 → `productId`
- 몇 개 담았는지 → `quantity`
- 추가/제거/조회 기능 필요

**타입 설계:**
```typescript
type CartItem = {
  productId: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  getItemQuantity: (productId: number) => number;
  getTotalQuantity: () => number;
};
```

---

#### 🔧 CartProvider 구현

```typescript
// src/providers/CartProvider.tsx
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 상품 추가 (수량 +1)
  const addItem = (productId: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);

      if (existingItem) {
        // 이미 있으면 수량 +1
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // 없으면 새로 추가
        return [...prev, { productId, quantity: 1 }];
      }
    });
  };

  // 상품 제거 (수량 -1)
  const removeItem = (productId: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.productId === productId);

      if (!existingItem) return prev;

      if (existingItem.quantity === 1) {
        // 수량이 1이면 아이템 제거
        return prev.filter(item => item.productId !== productId);
      } else {
        // 수량 -1
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
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

  // 전체 수량 조회
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
```

---

#### 💡 핵심 포인트

**1. 불변성 유지**
```typescript
// ❌ 나쁜 예
existingItem.quantity++;
items.push(newItem);

// ✅ 좋은 예
return prev.map(item => ({ ...item, quantity: item.quantity + 1 }));
return [...prev, newItem];
```

**2. find vs filter**
```typescript
// 하나 찾기
const item = items.find(item => item.productId === productId);

// 제거 (해당 항목 빼고 나머지 반환)
return items.filter(item => item.productId !== productId);
```

**3. reduce로 합계 계산**
```typescript
const total = items.reduce((sum, item) => sum + item.quantity, 0);
// [{ quantity: 2 }, { quantity: 3 }] → 5
```

---

### 2️⃣ 이벤트 버블링과 stopPropagation

#### ❓ 이벤트 버블링이 뭐야?

클릭 이벤트는 **자식 → 부모** 순서로 자동 전파돼요!

```
사용자 클릭
     │
     ▼
┌─────────────────────┐
│  ProductItem.Root   │ ◄── 3. 여기까지 전파됨!
│  onClick={...}      │     (상품 상세 페이지로 이동)
│                     │
│  ┌───────────────┐  │
│  │ Counter.Plus  │  │ ◄── 1. 먼저 클릭됨
│  │ onClick={...} │  │     (장바구니 추가)
│  └───────────────┘  │
│         ▲           │
│         │           │
│    2. 이벤트 전파!  │
└─────────────────────┘
```

---

#### 💥 문제 상황

**stopPropagation 없을 때:**
```typescript
<ProductItem.Root onClick={() => handleClickProduct(product.id)}>
  <Counter.Plus onClick={() => addItem(product.id)} />
</ProductItem.Root>
```

**버튼 클릭 시:**
1. `addItem()` 실행 ✅
2. 이벤트가 부모로 전파 ⚠️
3. `handleClickProduct()` 실행 😱
4. 상품 상세 페이지로 이동 (의도하지 않음!)

---

#### ✅ 해결: stopPropagation

```typescript
<ProductItem.Root onClick={() => handleClickProduct(product.id)}>
  <Counter.Plus onClick={(e) => {
    e.stopPropagation();  // 🛑 전파 중단!
    addItem(product.id);
  }} />
</ProductItem.Root>
```

**버튼 클릭 시:**
1. `addItem()` 실행 ✅
2. `stopPropagation()` 실행 🛑
3. 부모로 전파 안 됨 ✅
4. 페이지 이동 안 함 ✅

---

#### 📊 preventDefault vs stopPropagation

| 함수 | 역할 | 사용 예시 |
|------|------|----------|
| **preventDefault()** | 브라우저 기본 동작 막기 | • Form 제출 시 새로고침 방지<br>• 링크 클릭 시 이동 방지<br>• 우클릭 메뉴 막기 |
| **stopPropagation()** | 이벤트 전파(버블링) 막기 | • 부모 클릭 이벤트 실행 방지<br>• 중첩된 클릭 이벤트 처리<br>• 모달 내부 클릭 시 닫힘 방지 |

---

#### 🎯 실전 예시

```typescript
// 예시 1: 모달
<div onClick={closeModal}>  {/* 배경 */}
  <div onClick={(e) => e.stopPropagation()}>  {/* 모달 */}
    모달 내용 클릭해도 안 닫힘!
  </div>
</div>

// 예시 2: 드롭다운
<div onClick={closeDropdown}>  {/* 전체 화면 */}
  <div onClick={(e) => e.stopPropagation()}>
    메뉴 클릭해도 안 닫힘!
  </div>
</div>

// 예시 3: 우리 코드
<ProductItem.Root onClick={goToDetail}>
  <Counter.Plus onClick={(e) => {
    e.stopPropagation();  // 상세 페이지 이동 막기
    addToCart();          // 장바구니만 추가
  }} />
</ProductItem.Root>
```

---

### 3️⃣ Context.Provider의 정체

#### 🤔 CartContext.Provider는 어디서 나오는 거야?

```typescript
const CartContext = createContext<CartContextType | null>(null);
//    ^^^^^^^^^^^^
//    { Provider, Consumer, ... } 객체 반환!
```

**createContext가 반환하는 것:**
```typescript
const CartContext = {
  Provider: Component,  // ← React가 자동으로 만들어줌!
  Consumer: Component,
  displayName: string,
  // ...
}
```

---

#### 📊 시각화

```
createContext() 호출
      ↓
┌─────────────────────┐
│   CartContext       │  ← 객체가 반환됨!
├─────────────────────┤
│ • Provider          │  ← 컴포넌트 (데이터 제공자)
│ • Consumer          │  ← 컴포넌트 (거의 안 씀)
│ • displayName       │
└─────────────────────┘
      ↓
사용: <CartContext.Provider>
```

---

#### 💡 왜 CartProvider를 따로 만들까?

**React 기본 Provider 직접 사용:**
```typescript
// ❌ 복잡함
<CartContext.Provider value={{
  items: items,
  addItem: addItem,
  removeItem: removeItem,
  getItemQuantity: getItemQuantity,
  getTotalQuantity: getTotalQuantity
}}>
  <App />
</CartContext.Provider>
```

**우리가 만든 CartProvider:**
```typescript
// ✅ 간단함!
<CartProvider>
  <App />
</CartProvider>
```

**장점:**
1. 사용이 간단함
2. 로직을 Provider 안에 캡슐화
3. useState, 함수들을 내부에서 관리

---

### 4️⃣ 배열 메서드 활용

#### 🎨 find - 조건에 맞는 첫 번째 요소 찾기

```typescript
const existingItem = items.find(item => item.productId === productId);
// 있으면: { productId: 1, quantity: 3 }
// 없으면: undefined
```

---

#### 🎨 filter - 조건에 맞는 모든 요소 반환

```typescript
// 특정 항목 제거 (해당 항목 빼고 나머지)
const newItems = items.filter(item => item.productId !== productId);

// 카테고리 필터링
const cheeseProducts = products.filter(p => p.category === 'CHEESE');
```

---

#### 🎨 map - 모든 요소 변환

```typescript
// 수량 증가
const updated = items.map(item =>
  item.productId === productId
    ? { ...item, quantity: item.quantity + 1 }  // 조건 맞으면 변경
    : item                                       // 아니면 그대로
);
```

---

#### 🎨 reduce - 누적 계산

```typescript
// 총 수량 계산
const total = items.reduce((sum, item) => sum + item.quantity, 0);
//                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                          이전 합계 + 현재 아이템 수량

// 예시: [{ quantity: 2 }, { quantity: 3 }, { quantity: 1 }]
// 0 + 2 = 2
// 2 + 3 = 5
// 5 + 1 = 6
// 결과: 6
```

---

### 5️⃣ 조건부 렌더링과 비활성화

#### 🎯 재고 기반 버튼 비활성화

```typescript
<Counter.Plus
  disabled={quantity >= product.stock}  // 재고보다 많으면 비활성화
  onClick={(e) => {
    e.stopPropagation();
    addItem(product.id);
  }}
/>
```

**동작:**
- 재고 3개, 현재 수량 0 → 활성화 ✅
- 재고 3개, 현재 수량 2 → 활성화 ✅
- 재고 3개, 현재 수량 3 → 비활성화 ⚠️

---

#### 🎯 수량 0일 때 - 버튼 비활성화

```typescript
<Counter.Minus
  disabled={quantity === 0}  // 0개면 비활성화
  onClick={(e) => {
    e.stopPropagation();
    removeItem(product.id);
  }}
/>
```

---

#### 🎯 조건부 태그 표시

```typescript
let freeTagType: 'milk' | 'caffeine' | 'gluten' | undefined;

if (product.isGlutenFree) {
  freeTagType = 'gluten';
} else if (product.isCaffeineFree) {
  freeTagType = 'caffeine';
}

// 조건부 렌더링
{freeTagType && <ProductItem.FreeTag type={freeTagType} />}
```

---

## 🎨 아키텍처 다이어그램

### 전체 시스템 구조

```
┌─────────────────────────────────────────────────┐
│                   App.tsx                       │
│  ┌───────────────────────────────────────────┐  │
│  │         GlobalProvider                    │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      CurrencyProvider               │  │  │
│  │  │  (환율, 가격 변환)                   │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      CartProvider                   │  │  │
│  │  │                                     │  │  │
│  │  │  State: items[]                     │  │  │
│  │  │  • addItem()                        │  │  │
│  │  │  • removeItem()                     │  │  │
│  │  │  • getItemQuantity()                │  │  │
│  │  │  • getTotalQuantity()               │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
    ┌─────▼─────┐         ┌──────▼──────┐
    │  Header   │         │  HomePage   │
    │           │         │             │
    │  Badge    │         │ ProductList │
    │  (총수량) │         │             │
    └─────▲─────┘         └──────┬──────┘
          │                      │
          │                      │
          │              ┌───────▼────────┐
          │              │ ProductItem    │
          │              │ • Counter +/-  │
          │              │ • 재고 체크    │
          │              └───────┬────────┘
          │                      │
          └──────────────────────┘
              getTotalQuantity()
              getItemQuantity()
```

---

### 이벤트 전파 흐름

```
사용자가 + 버튼 클릭
        │
        ▼
┌────────────────────────────────┐
│ ProductItem.Root               │
│ onClick: 상품 상세 페이지 이동  │ ◄─ 실행 안 됨! (stopPropagation)
│                                │
│  ┌──────────────────────────┐  │
│  │ Counter.Plus             │  │
│  │ onClick:                 │  │ ◄─ 클릭!
│  │  1. stopPropagation() 🛑│  │
│  │  2. addItem()           │  │
│  └──────────────────────────┘  │
│             X (전파 차단!)     │
└────────────────────────────────┘
        │
        ▼
┌────────────────────────────────┐
│ CartProvider                   │
│ • items 업데이트                │
│ • quantity + 1                 │
└────────────────────────────────┘
        │
        ▼ (자동 리렌더링)
┌────────────────────────────────┐
│ Header Badge                   │
│ • getTotalQuantity() 호출      │
│ • 뱃지 숫자 업데이트            │
└────────────────────────────────┘
```

---

## 🐛 트러블슈팅

### 문제 1: 버튼 클릭 시 상세 페이지로 이동

**증상:**
장바구니 +/- 버튼을 누르면 상품 상세 페이지로 이동해버림

**원인:**
이벤트 버블링으로 부모의 onClick도 실행됨

**해결:**
```typescript
<Counter.Plus onClick={(e) => {
  e.stopPropagation();  // 추가!
  addItem(product.id);
}} />
```

---

### 문제 2: 필터링이 동작 안 함

**증상:**
카테고리 탭을 눌러도 전체 상품이 표시됨

**원인:**
`products` 대신 `filteredProducts`를 사용해야 함

**해결:**
```typescript
// ❌ 잘못된 코드
{products.map(product => ...)}

// ✅ 올바른 코드
{filteredProducts.map(product => ...)}
```

---

### 문제 3: FreeTag 위치 오류

**증상:**
태그가 레이아웃을 벗어남

**원인:**
`Meta` 컴포넌트 밖에 FreeTag를 배치

**해결:**
```typescript
// ❌ 잘못된 코드
</ProductItem.Meta>
{freeTagType && <ProductItem.FreeTag type={freeTagType} />}

// ✅ 올바른 코드
<ProductItem.Meta>
  <ProductItem.MetaLeft>...</ProductItem.MetaLeft>
  {freeTagType && <ProductItem.FreeTag type={freeTagType} />}
</ProductItem.Meta>
```

---

## 💡 핵심 개념 정리

### 장바구니 Context
- **목적:** 전역 장바구니 상태 관리
- **구성:** items 배열 + CRUD 함수들
- **장점:** 컴포넌트 간 상태 공유 쉬움
- **주의:** 불변성 유지 필수!

### 이벤트 버블링
- **개념:** 이벤트가 자식 → 부모로 자동 전파
- **문제:** 의도하지 않은 이벤트 실행
- **해결:** stopPropagation()으로 전파 차단
- **구분:** preventDefault()와 다름!

### 배열 메서드
- **find:** 조건에 맞는 첫 요소 찾기
- **filter:** 조건에 맞는 모든 요소 반환
- **map:** 모든 요소 변환
- **reduce:** 누적 계산

---

## 🎓 배운 점

1. **Context는 여러 개 만들 수 있다!**
   - CurrencyProvider + CartProvider
   - 각자 독립적으로 동작
   - GlobalProvider에서 통합

2. **이벤트 버블링을 이해하면 복잡한 UI도 쉽게!**
   - stopPropagation()의 중요성
   - 중첩된 클릭 영역 처리
   - 모달/드롭다운/카드 등에 활용

3. **배열 메서드는 불변성의 핵심!**
   - map으로 업데이트
   - filter로 삭제
   - find로 검색
   - reduce로 합계

4. **조건부 렌더링의 다양한 활용!**
   - disabled 속성
   - && 연산자
   - 삼항 연산자

5. **타입 설계는 요구사항에서!**
   - 무엇을 저장할지
   - 어떤 기능이 필요한지
   - 서버 데이터 구조는 어떤지

---

## 📌 다음에 해볼 것

- [ ] 상품 상세 페이지 완성
- [ ] 장바구니 페이지 구현
- [ ] LocalStorage에 장바구니 저장
- [ ] 결제 기능 구현
- [ ] React Query로 리팩토링
- [ ] 낙관적 업데이트 적용

---

## 🔗 참고 자료

- [React Context 공식 문서](https://react.dev/reference/react/createContext)
- [이벤트 버블링 MDN](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Building_blocks/Events#event_bubbling_and_capture)
- [배열 메서드 MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array)
- Moon Cheese 프로젝트 코드
  - [CartProvider.tsx](src/providers/CartProvider.tsx)
  - [ProductListSection.tsx](src/pages/HomePage/components/ProductListSection.tsx)
  - [Header.tsx](src/layout/Header.tsx)

---

**🧀 Happy Coding! 🌙**
