## Installation

과제는 Node.js 18.19.0 version 기준으로 개발했습니다.

```
$ npm install | yarn
```

<BR>

## Environment

환경 변수는 프로젝트의 루트 패스 기준으로 ./dotenv/.env.${NODE_ENV} 라는 이름으로 파일을 생성해서 아래 내용을 기입해주시면 됩니다.

```
# DB
DB_HOST=localhost
DB_PORT=5432
DB_USER_NAME=DB_USER_NAME
DB_PASSWORD=postgres
DB_DATABASE=postgres
```

<BR>

## Running the app

데모를 실행할 때는 npm run start:dev로 실행해주세요.

```
$ npm run start:dev | yarn start:dev
```

테스트 코드를 실행할 때는 npm run test로 실행해주세요.

```
$ npm run test | yarn test
```

<BR>

## 테이블 생성 DDL

### customer table DDL

```
CREATE TABLE customers (
id INT CHECK (id > 0) NOT NULL,
name VARCHAR(30) NOT NULL,
grade VARCHAR(30) CHECK (GRADE IN ('A', 'B', 'C')) NOT NULL
PRIMARY KEY (id)
);
```

### orders table DDL

```
CREATE TABLE orders (
id INT CHECK (id > 0) NOT NULL GENERATED ALWAYS AS IDENTITY,
customer_id INT NULL,
amount INT NOT NULL,
ordered_at TIMESTAMPTZ NOT NULL,
order_type VARCHAR(30) CHECK (ORDER_TYPE IN ('A', 'B', 'C')) NOT NULL,
PRIMARY KEY (id),
CONSTRAINT customer_order_fk FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE ON UPDATE CASCADE");
```

<br>

## 기능 구현

### 공통 기능

- Transaction Decorator 구현
- ErrorInterceptor, TypeORMException 구현
- BaseRepository 구현

### 고객정보 및 주문내역정보 업로드 API

#### enpoint

- POST http://localhost:3000/excel/save

#### 라이브러리

- xlsx 라이브러리 사용

#### 구현 방식

- excel import 기능을 담당하는 ExcelHelperProvider 구현
- ExcelHelperProvider를 주입받아 excel 데이터를 받은 뒤 비즈니스 로직을 처리하는 ExcelService 구현

<br>

### 월별 매출 통계 API

#### enpoint

- POST http://localhost:3000/orders/stat

#### 구현 방식

- 월별 매출 통계 기능을 수행하기 위한 getMonthlySalesStatistics method를 OrderRepository에 구현

#### 예시 코드

```
 @TransformPlainToInstance(OrderMonthlySalesStat)
  async getMonthlySalesStatistics(): Promise<OrderMonthlySalesStat[]> {
    const subQueryAlias = 'tmp';

    // Creating a subquery
    const subQuery = this.getSubQueryBuilder(subQueryAlias)
      .select([
        'id',
        'EXTRACT(YEAR FROM ordered_at) AS year',
        'EXTRACT(MONTH FROM ordered_at) AS month',
        'CASE WHEN order_type = :refundType THEN amount ELSE 0 END AS refund_amount',
        'CASE WHEN order_type = :refundType THEN 0 ELSE amount END AS order_amount',
      ])
      .getQuery();

    // Main query
    return this.getQueryBuilder()
      .select(`${subQueryAlias}.year`, 'year')
      .addSelect(`${subQueryAlias}.month`, 'month')
      .addSelect(`SUM(${subQueryAlias}.refund_amount)`, 'totalRefundAmount')
      .addSelect(`SUM(${subQueryAlias}.order_amount)`, 'totalOrderAmount')
      .innerJoin(`(${subQuery})`, subQueryAlias, 'order.id = tmp.id')
      .groupBy('year, month')
      .setParameters({ refundType: OrderType.REFUND })
      .orderBy('year, month')
      .getRawMany();
  }
```

<br>

### 주문 목록 조회 API

#### enpoint

- GET http://localhost:3000/orders
- query: startDate, endDate, orderType, customerId, pageSize, pageNo

#### 구현 방식

- OrderListQueryDto를 구현하여, validation 및 default 값 설정

#### 예시 코드

```
export class OrderListQueryDto {
  @Transform(({ value }) => moment(value).toDate())
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => moment(value).toDate())
  @IsDate()
  endDate: Date;

  @IsNumber()
  orderType = 2;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsNumber()
  pageSize = 50;

  @IsNumber()
  pageNo = 1;
}

```

- orderedAt(주문일자) 값이 DB에는 `timestamptz` 형식으로 저장되어있기 때문에 결과 값 반환 시 `YYYY-MM-DD` 형식으로 반환해주어야합니다.

- 이와 같은 요구사항을 처리하기 위해 class-transformer, reflect-metadata를 사용해 모든 HTTP 요청에서 직렬화가 가능하도록 글로벌 직렬화 인터셉터 추가

- `OrderListResponseDto` 구현

#### 예시 코드

```

export class OrderListResponseDto {
  @Exclude() private _orderId: number;
  @Exclude() private _orderAmount: number;
  @Exclude() private _customerName: string;
  @Exclude() private _customerGrade: string;
  @Exclude() private _orderType: OrderType;
  @Exclude() private _orderedAt: Date;

  static of(getOrderList: Array<GetOrderList>) {
    return getOrderList.map((getOrder) => {
      const orderListResponseDto = new OrderListResponseDto();
      orderListResponseDto._orderId = getOrder.orderId;
      orderListResponseDto._orderAmount = getOrder.orderAmount;
      orderListResponseDto._customerName = getOrder.customerName;
      orderListResponseDto._customerGrade = getOrder.customerGrade;
      orderListResponseDto._orderType = getOrder.orderType;
      orderListResponseDto._orderedAt = getOrder.orderedAt;
      return orderListResponseDto;
    });
  }

  @Expose()
  get orderId(): number {
    return this._orderId;
  }
  @Expose()
  get orderAmount(): number {
    return this._orderAmount;
  }
  @Expose()
  get customerName(): string {
    return this._customerName;
  }
  @Expose()
  get customerGrade(): string {
    return this._customerGrade;
  }
  @Expose()
  get orderType(): OrderType {
    return this._orderType;
  }
  @Expose()
  get orderedAt(): string {
    return moment(this._orderedAt).format('YYYY-MM-DD');
  }
}
```

- query parameter의 값에 따라 동적으로 filter를 적용하여 order 리스트를 가져오는 기능을 구현하는 getOrderList method를 OrderRepository에 구현

#### 예시 코드

```
 @TransformPlainToInstance(GetOrderList)
  async getOrderList(
    startDate: Date,
    endDate: Date,
    orderType: number,
    customerId: number,
    pageSize: number,
    pageNo: number,
  ): Promise<GetOrderList[]> {
    const queryBuilder = this.getQueryBuilder()
      .select('order.ordered_at', 'orderedAt')
      .addSelect('order.order_type', 'orderType')
      .addSelect('order.amount', 'orderAmount')
      .addSelect('order.id', 'orderId')
      .addSelect('customer.name', 'customerName')
      .addSelect('customer.grade', 'customerGrade')
      .leftJoin('order.Customer', 'customer')
      .andWhere('order.orderedAt >= :startDate', { startDate })
      .andWhere('order.orderedAt <= :endDate', { endDate })
      .orderBy('order.orderedAt', 'DESC');

    switch (orderType) {
      case 0:
        queryBuilder.andWhere('order.orderType = :orderType', {
          orderType: OrderType.ORDER,
        });
        break;
      case 1:
        queryBuilder.andWhere('order.orderType = :orderType', {
          orderType: OrderType.REFUND,
        });
        break;
    }

    if (customerId) {
      queryBuilder.andWhere('order.customerId = :customerId', { customerId });
    }

    return queryBuilder
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .getRawMany();
  }
```

### 테스트 코드 구현

- orderService, excelService 테스트 코드 구현
- NestJS 의존성 주입 시, 생성자에서 interface를 통한 주입을 구현함으로써 각 컴포넌트들 간의 결합도를 낮추어 더 용이하게 테스트 코드를 작성할 수 있도록 구현하였습니다.

#### 코드 예시

```
describe('excel service', () => {
  let orderRepository: MockProxy<IOrderRepository>;
  let customerRepository: MockProxy<ICustomerRepository>;
  let excelHelperProvider: MockProxy<IExcelHelperProvider>;
  let service: IExcelService;

  beforeAll(async () => {
    orderRepository = mock<IOrderRepository>();
    customerRepository = mock<ICustomerRepository>();
    excelHelperProvider = mock<IExcelHelperProvider>();
    service = new ExcelService(
      excelHelperProvider,
      customerRepository,
      orderRepository,
    );
  });

  // 좀 더 mocking 하기 쉬워졌다...
  // ...
}
```
