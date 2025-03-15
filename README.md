# @agions/utils

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/agions/utils/ci.yml?logo=github)
![npm](https://img.shields.io/npm/v/@agions/utils?logo=npm)
![Coverage](https://img.shields.io/coveralls/github/agions/utils/main?logo=coveralls)

🔧 现代化的TypeScript工具库，包含200+精心设计的实用函数，涵盖日期处理、字符串操作、数组处理等常见需求

## 项目亮点
- 🚀 零依赖、轻量级设计
- 📦 完善的TypeScript类型支持
- ✅ 100%单元测试覆盖率
- 🔄 持续集成自动化
- 📖 详尽的文档示例

## 安装

## 安装

```bash
npm install @agions/utils
# 或
yarn add @agions/utils
```

## 功能特性

- 时间相对化处理（formatTimeAgo）：自动转换时间为'几秒前'、'几分钟前'、'3天前'、'3月15日'等中文描述
- 全面的TypeScript类型支持，提供完善的类型定义
- 丰富的工具函数集合，涵盖日常开发常用功能
- 模块化设计，支持按需引入，减小打包体积
- 零依赖，轻量级，不会引入额外的包
- 完善的单元测试，确保代码质量

## 使用方法

### 基本用法

```typescript
// 引入单个工具函数
import { formatDate } from '@agions/utils';

const formattedDate = formatDate(new Date(), 'YYYY-MM-DD');
console.log(formattedDate); // 例如：2023-04-01
```

### 命名空间用法

```typescript
// 引入特定分类下的所有工具函数
import { string } from '@agions/utils';

const trimmedStr = string.trim('  Hello World  ');
console.log(trimmedStr); // 'Hello World'
```

### 处理命名冲突

```typescript
// 使用重命名导出解决命名冲突
import { objectIsEmpty, validatorIsEmpty } from '@agions/utils';

console.log(objectIsEmpty({})); // true - 对象是否为空
console.log(validatorIsEmpty('')); // true - 值是否为空
```

## 🛠️ 贡献指南

欢迎通过以下方式参与贡献：
1. Fork仓库并创建分支
2. 提交清晰的commit信息
3. 编写单元测试
4. 发起Pull Request

## API文档

### 日期处理 (date)

```typescript
import { formatDate, isLeapYear, getDaysInMonth, addDays, diffDays } from '@agions/utils';
// 或
import { date } from '@agions/utils';
```

- `formatDate(date: Date, format?: string): string` - 格式化日期
  ```typescript
  formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'); // '2023-04-01 12:30:45'
  ```

- `isLeapYear(year: number): boolean` - 判断是否为闰年
  ```typescript
  isLeapYear(2024); // true
  ```

- `getDaysInMonth(year: number, month: number): number` - 获取月份天数
  ```typescript
  getDaysInMonth(2023, 2); // 28 (2月)
  ```

- `addDays(date: Date, days: number): Date` - 添加天数
  ```typescript
  addDays(new Date('2023-04-01'), 5); // 2023-04-06
  ```

- `diffDays(date1: Date, date2: Date): number` - 计算两个日期之间的天数差
  ```typescript
  diffDays(new Date('2023-04-01'), new Date('2023-04-06')); // 5
  ```

### 字符串处理 (string)

```typescript
import { trim, capitalize, camelCase, kebabCase, snakeCase, truncate, parseTemplate } from '@agions/utils';
// 或
import { string } from '@agions/utils';
```

- `trim(str: string): string` - 去除字符串两端空格
  ```typescript
  trim('  Hello World  '); // 'Hello World'
  ```

- `capitalize(str: string): string` - 首字母大写
  ```typescript
  capitalize('hello'); // 'Hello'
  ```

- `camelCase(str: string): string` - 转换为驼峰命名
  ```typescript
  camelCase('hello-world'); // 'helloWorld'
  ```

- `kebabCase(str: string): string` - 转换为短横线命名
  ```typescript
  kebabCase('helloWorld'); // 'hello-world'
  ```

- `snakeCase(str: string): string` - 转换为下划线命名
  ```typescript
  snakeCase('helloWorld'); // 'hello_world'
  ```

- `truncate(str: string, length: number, suffix?: string): string` - 截断字符串
  ```typescript
  truncate('Hello World', 5); // 'Hello...'
  ```

- `parseTemplate(template: string, data: Record<string, any>): string` - 解析模板字符串
  ```typescript
  parseTemplate('Hello, ${name}!', { name: 'World' }); // 'Hello, World!'
  ```

### 数组处理 (array)

```typescript
import { unique, flatten, chunk, shuffle, groupBy } from '@agions/utils';
// 或
import { array } from '@agions/utils';
```

- `unique<T>(arr: T[]): T[]` - 数组去重
  ```typescript
  unique([1, 1, 2, 3, 3]); // [1, 2, 3]
  ```

- `flatten<T>(arr: any[], depth?: number): T[]` - 数组扁平化
  ```typescript
  flatten([1, [2, [3, 4]]]); // [1, 2, 3, 4]
  ```

- `chunk<T>(arr: T[], size: number): T[][]` - 数组分块
  ```typescript
  chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
  ```

- `shuffle<T>(arr: T[]): T[]` - 数组随机排序
  ```typescript
  shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4] (随机结果)
  ```

- `groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]>` - 数组分组
  ```typescript
  groupBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd');
  // { even: [2, 4], odd: [1, 3, 5] }
  ```

### 对象处理 (object)

```typescript
import { pick, omit, deepClone, merge, isEqual, get, set, isEmpty, flatten } from '@agions/utils';
// 或
import { object } from '@agions/utils';
```

- `pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>` - 选取对象属性
  ```typescript
  pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
  ```

- `omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>` - 忽略对象属性
  ```typescript
  omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
  ```

- `deepClone<T>(obj: T): T` - 深拷贝对象
  ```typescript
  deepClone({ a: 1, b: { c: 2 } }); // { a: 1, b: { c: 2 } }
  ```

- `merge<T extends object>(target: T, ...sources: Partial<T>[]): T` - 合并对象
  ```typescript
  merge({ a: 1 }, { b: 2 }, { c: 3 }); // { a: 1, b: 2, c: 3 }
  ```

- `isEqual(obj1: any, obj2: any): boolean` - 判断两个对象是否相等
  ```typescript
  isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // true
  ```

- `get<T = any>(obj: any, path: string, defaultValue?: any): T` - 获取对象路径值
  ```typescript
  get({ a: { b: { c: 42 } } }, 'a.b.c'); // 42
  ```

- `set<T extends object>(obj: T, path: string, value: any): T` - 设置对象路径值
  ```typescript
  set({ a: { b: {} } }, 'a.b.c', 42); // { a: { b: { c: 42 } } }
  ```

- `isEmpty(obj: object): boolean` - 判断对象是否为空
  ```typescript
  isEmpty({}); // true
  ```

- `flatten(obj: Record<string, any>): Record<string, any>` - 扁平化对象
  ```typescript
  flatten({ a: { b: { c: 1 } } }); // { 'a.b.c': 1 }
  ```

### 数学计算 (math)

```typescript
import { round, floor, ceil, random, clamp, median } from '@agions/utils';
// 或
import { math } from '@agions/utils';
```

- `round(num: number, precision?: number): number` - 四舍五入
  ```typescript
  round(1.2345, 2); // 1.23
  ```

- `floor(num: number, precision?: number): number` - 向下取整
  ```typescript
  floor(1.2345, 2); // 1.23
  ```

- `ceil(num: number, precision?: number): number` - 向上取整
  ```typescript
  ceil(1.2345, 2); // 1.24
  ```

- `random(min?: number, max?: number, isInteger?: boolean): number` - 生成随机数
  ```typescript
  random(1, 10); // 5.123456789 (随机结果)
  random(1, 10, true); // 5 (随机整数)
  ```

- `clamp(num: number, min: number, max: number): number` - 限制数值范围
  ```typescript
  clamp(15, 1, 10); // 10
  clamp(-5, 1, 10); // 1
  ```

- `median(numbers: number[]): number` - 计算中位数
  ```typescript
  median([1, 3, 5, 7, 9]); // 5
  ```

### 验证器 (validator)

```typescript
import { isEmail, isURL, isPhoneNumber, isIDCard, isIPv4, isEmpty, isNumeric } from '@agions/utils';
// 或
import { validator } from '@agions/utils';
```

- `isEmail(email: string): boolean` - 验证邮箱
  ```typescript
  isEmail('test@example.com'); // true
  ```

- `isURL(url: string): boolean` - 验证URL
  ```typescript
  isURL('https://example.com'); // true
  ```

- `isPhoneNumber(phoneNumber: string): boolean` - 验证手机号（中国大陆）
  ```typescript
  isPhoneNumber('13812345678'); // true
  ```

- `isIDCard(idCard: string): boolean` - 验证身份证号（中国大陆）
  ```typescript
  isIDCard('110101199001011234'); // true
  ```

- `isIPv4(ip: string): boolean` - 验证IPv4地址
  ```typescript
  isIPv4('192.168.1.1'); // true
  ```

- `isEmpty(value: any): boolean` - 验证是否为空值
  ```typescript
  isEmpty(null); // true
  isEmpty(''); // true
  isEmpty([]); // true
  ```

- `isNumeric(str: string): boolean` - 验证是否为数字字符串
  ```typescript
  isNumeric('123'); // true
  isNumeric('12.34'); // true
  ```

### 网络请求 (request)

```typescript
import { request } from '@agions/utils';

// 带重试机制的GET请求
const fetchData = request.create({
  baseURL: 'https://api.example.com',
  retry: 3,
  timeout: 5000
});

// 使用示例
fetchData.get('/users').then(console.log);
```

### 其他工具 (misc)

```typescript
import { debounce, throttle, sleep, retry, memoize } from '@agions/utils';
// 或
import { misc } from '@agions/utils';

// 树结构搜索示例
const tree = {
  id: 1,
  children: [
    { id: 2, name: 'Child 1' },
    { 
      id: 3,
      children: [{ id: 4, name: 'Grandchild' }]
    }
  ]
};

const foundNode = misc.findNode(tree, node => node.id === 4);
console.log(foundNode); // { id: 4, name: 'Grandchild' }
```

- `debounce<T extends (...args: any[]) => any>(fn: T, wait?: number): (...args: Parameters<T>) => void` - 防抖函数
  ```typescript
  const debouncedFn = debounce(() => console.log('Debounced'), 500);
  ```

- `throttle<T extends (...args: any[]) => any>(fn: T, wait?: number): (...args: Parameters<T>) => void` - 节流函数
  ```typescript
  const throttledFn = throttle(() => console.log('Throttled'), 500);
  ```

- `sleep(ms: number): Promise<void>` - 延迟执行
  ```typescript
  await sleep(1000); // 等待1秒
  ```

- `retry<T>(fn: () => Promise<T>, options: { retries: number; delay: number }): () => Promise<T>` - 重试函数
  ```typescript
  const fetchWithRetry = retry(() => fetch('https://api.example.com'), { retries: 3, delay: 1000 });
  ```

- `memoize<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T>` - 缓存函数结果
  ```typescript
  const memoizedFn = memoize((a, b) => a + b);
  ```

### 网络请求 (request)

```typescript
import { request, get, post } from '@agions/utils';
// 或
import { request } from '@agions/utils';
```

- `request<T = any>(url: string, options?: RequestOptions): Promise<T>` - 通用请求方法
  ```typescript
  request('https://api.example.com/data');
  ```

- `get<T = any>(url: string): Promise<T>` - GET请求
  ```typescript
  get('https://api.example.com/data');
  ```

- `post<T = any>(url: string, body: Record<string, any>, options?: RequestOptions): Promise<T>` - POST请求
  ```typescript
  post('https://api.example.com/data', { name: 'test' });
  ```

## 贡献指南

欢迎提交问题和功能需求，也欢迎提交Pull Request。

## 许可证

[MIT](LICENSE)