# 🧀 Moon Cheese 프로젝트 TIL

> React Context API, 전역 상태 관리, 그리고 비동기 처리 학습 기록

---

## 📅 학습 날짜
2025-10-03

---

## 🎯 구현한 기능

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

## 📌 다음에 해볼 것

- [ ] ProductListSection API 연동
- [ ] 장바구니 기능 구현
- [ ] 상품 상세 페이지 완성
- [ ] React Query로 리팩토링 (캐싱, 자동 재시도)
- [ ] Error Boundary 적용 (전역 에러 처리)

---

## 🔗 참고 자료

- [React Context 공식 문서](https://react.dev/reference/react/createContext)
- [Promise.all MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- Moon Cheese 프로젝트 코드
  - [CurrencyProvider.tsx](src/providers/CurrencyProvider.tsx)
  - [CurrentLevelSection.tsx](src/pages/HomePage/components/CurrentLevelSection.tsx)
  - [handlers.ts](src/server/handlers.ts)

---

**🧀 Happy Coding! 🌙**
