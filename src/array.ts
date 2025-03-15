/**
 * 数组处理工具函数
 */

/**
 * 数组去重
 * @param arr 输入数组
 * @returns 去重后的数组
 * @example
 * unique([1, 1, 2, 3, 3]) // => [1, 2, 3]
 */
export function unique<T>(arr: T[]): T[] {
  // 使用 Array.from 替代展开运算符，避免 Set 迭代的兼容性问题
  return Array.from(new Set(arr));
}

/**
 * 数组扁平化
 * @param arr 输入数组
 * @param depth 扁平化深度，默认为Infinity
 * @returns 扁平化后的数组
 * @example
 * flatten([1, [2, [3, 4]]]) // => [1, 2, 3, 4]
 * flatten([1, [2, [3, 4]]], 1) // => [1, 2, [3, 4]]
 */
export function flatten<T>(arr: any[], depth: number = Infinity): T[] {
  return arr.flat(depth);
}

/**
 * 数组分块
 * @param arr 输入数组
 * @param size 分块大小
 * @returns 分块后的二维数组
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // => [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [];
  
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  
  return result;
}

/**
 * 数组随机排序
 * @param arr 输入数组
 * @returns 随机排序后的新数组
 * @example
 * shuffle([1, 2, 3, 4, 5]) // => [3, 1, 5, 2, 4] (随机结果)
 */
export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 数组分组
 * @param arr 输入数组
 * @param keyFn 分组键函数
 * @returns 分组后的对象
 * @example
 * groupBy([1, 2, 3, 4, 5], (n) => n % 2 === 0 ? 'even' : 'odd') // => { odd: [1, 3, 5], even: [2, 4] }
 */
export function groupBy<T, K extends string | number | symbol>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
}

/**
 * 数组排序（稳定排序）
 * @param arr 输入数组
 * @param compareFn 比较函数
 * @returns 排序后的新数组
 * @example
 * sortBy([{name: 'John', age: 30}, {name: 'Jane', age: 25}], (a, b) => a.age - b.age)
 * // => [{name: 'Jane', age: 25}, {name: 'John', age: 30}]
 */
export function sortBy<T>(arr: T[], compareFn: (a: T, b: T) => number): T[] {
  return [...arr].sort(compareFn);
}

/**
 * 按对象属性排序
 * @param arr 输入对象数组
 * @param key 排序的属性名
 * @param order 排序顺序，默认为'asc'（升序）
 * @returns 排序后的新数组
 * @example
 * sortByKey([{name: 'John', age: 30}, {name: 'Jane', age: 25}], 'age')
 * // => [{name: 'Jane', age: 25}, {name: 'John', age: 30}]
 */
export function sortByKey<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return order === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }
    
    return order === 'asc' ? (valueA > valueB ? 1 : -1) : (valueA > valueB ? -1 : 1);
  });
}

/**
 * 查找数组中的最大值
 * @param arr 输入数字数组
 * @returns 最大值
 * @example
 * max([1, 5, 3, 9, 2]) // => 9
 */
export function max(arr: number[]): number {
  return Math.max(...arr);
}

/**
 * 查找数组中的最小值
 * @param arr 输入数字数组
 * @returns 最小值
 * @example
 * min([1, 5, 3, 9, 2]) // => 1
 */
export function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * 计算数组元素之和
 * @param arr 输入数字数组
 * @returns 元素之和
 * @example
 * sum([1, 2, 3, 4]) // => 10
 */
export function sum(arr: number[]): number {
  return arr.reduce((total, num) => total + num, 0);
}

/**
 * 计算数组元素的平均值
 * @param arr 输入数字数组
 * @returns 平均值
 * @example
 * average([1, 2, 3, 4]) // => 2.5
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * 数组去重并按条件过滤
 * @param arr 输入数组
 * @param filterFn 过滤函数
 * @returns 去重并过滤后的数组
 * @example
 * uniqueFilter([1, 2, 2, 3, 4, 4, 5], (n) => n > 2) // => [3, 4, 5]
 */
export function uniqueFilter<T>(arr: T[], filterFn: (item: T) => boolean): T[] {
  return Array.from(new Set(arr)).filter(filterFn);
}

/**
 * 查找数组中符合条件的第一个元素的索引
 * @param arr 输入数组
 * @param predicate 断言函数
 * @returns 元素索引，未找到返回-1
 * @example
 * findIndex([{id: 1, name: 'John'}, {id: 2, name: 'Jane'}], (item) => item.id === 2) // => 1
 */
export function findIndex<T>(arr: T[], predicate: (item: T, index: number) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i], i)) {
      return i;
    }
  }
  return -1;
}

/**
 * 数组交集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 交集数组
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // => [2, 3]
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => arr2.includes(item));
}

/**
 * 数组并集
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 并集数组
 * @example
 * union([1, 2, 3], [2, 3, 4]) // => [1, 2, 3, 4]
 */
export function union<T>(arr1: T[], arr2: T[]): T[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

/**
 * 数组差集 (arr1 - arr2)
 * @param arr1 数组1
 * @param arr2 数组2
 * @returns 差集数组
 * @example
 * difference([1, 2, 3, 4], [2, 4]) // => [1, 3]
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(item => !arr2.includes(item));
}