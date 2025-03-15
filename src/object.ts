/**
 * 对象处理工具函数
 */

/**
 * 选取对象属性
 * @param obj 输入对象
 * @param keys 要选取的属性数组
 * @returns 包含选取属性的新对象
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * 忽略对象属性
 * @param obj 输入对象
 * @param keys 要忽略的属性数组
 * @returns 不包含忽略属性的新对象
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { b: 2 }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * 深拷贝对象
 * @param obj 输入对象
 * @returns 深拷贝后的新对象
 * @example
 * const obj = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(obj);
 * cloned.b.c = 3;
 * console.log(obj.b.c); // => 2
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Object) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepClone(value)])
    ) as unknown as T;
  }

  return obj;
}

/**
 * 合并对象
 * @param target 目标对象
 * @param sources 源对象数组
 * @returns 合并后的对象
 * @example
 * merge({ a: 1 }, { b: 2 }, { c: 3 }) // => { a: 1, b: 2, c: 3 }
 */
export function merge<T extends object>(
  target: T,
  ...sources: Partial<T>[]
): T {
  if (!sources.length) return target;
  
  const source = sources.shift();
  if (source === undefined) return target;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const targetValue = (target as any)[key];
      const sourceValue = (source as any)[key];

      if (Array.isArray(sourceValue)) {
        if (!Array.isArray(targetValue)) {
          (target as any)[key] = sourceValue;
        } else {
          (target as any)[key] = targetValue.concat(sourceValue);
        }
      } else if (
        isObject(sourceValue) &&
        Object.prototype.hasOwnProperty.call(target, key) &&
        isObject(targetValue)
      ) {
        (target as any)[key] = merge(targetValue, sourceValue);
      } else {
        (target as any)[key] = sourceValue;
      }
    });
  }

  return merge(target, ...sources);
}

/**
 * 判断两个对象是否相等
 * @param obj1 对象1
 * @param obj2 对象2
 * @returns 是否相等
 * @example
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // => true
 * isEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) // => true
 * isEqual({ a: 1, b: 2 }, { a: 1, b: 3 }) // => false
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object' ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
    return isEqual(obj1[key], obj2[key]);
  });
}

/**
 * 获取对象路径值
 * @param obj 输入对象
 * @param path 路径字符串，使用点号或方括号表示，如'a.b.c'或'a[0].b.c'
 * @param defaultValue 默认值，当路径不存在时返回
 * @returns 路径值或默认值
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * get(obj, 'a.b.c') // => 42
 * get(obj, 'a.b.d', 'default') // => 'default'
 * get({ a: [{ b: 1 }] }, 'a[0].b') // => 1
 */
export function get<T = any>(obj: any, path: string, defaultValue?: any): T {
  if (!obj || !path) return defaultValue as T;

  // 将路径转换为数组，处理点号和方括号表示法
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue as T;
    }
    result = result[key];
  }

  return (result === undefined ? defaultValue : result) as T;
}

/**
 * 设置对象路径值
 * @param obj 输入对象
 * @param path 路径字符串，使用点号或方括号表示，如'a.b.c'或'a[0].b.c'
 * @param value 要设置的值
 * @returns 修改后的对象
 * @example
 * const obj = { a: { b: { c: 42 } } };
 * set(obj, 'a.b.c', 100) // => { a: { b: { c: 100 } } }
 * set(obj, 'a.b.d', 'new') // => { a: { b: { c: 100, d: 'new' } } }
 */
export function set<T extends object>(obj: T, path: string, value: any): T {
  if (!obj || !path) return obj;

  // 将路径转换为数组，处理点号和方括号表示法
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  const lastKey = keys.pop();
  if (!lastKey) return obj;

  let current:any = obj;
  for (const key of keys) {
    if (current[key] === undefined) {
      // 判断下一个键是否为数字，决定创建对象还是数组
      const nextKey = keys[keys.indexOf(key) + 1] || lastKey;
      current[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

/**
 * 判断对象是否为空
 * @param obj 输入对象
 * @returns 是否为空对象
 * @example
 * isEmpty({}) // => true
 * isEmpty({ a: 1 }) // => false
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * 扁平化对象
 * @param obj 输入对象
 * @param prefix 前缀，用于递归调用
 * @returns 扁平化后的对象
 * @example
 * flatten({ a: { b: { c: 1, d: 2 } } }) // => { 'a.b.c': 1, 'a.b.d': 2 }
 */
export function flatten(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc:any, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (isObject(obj[key])) {
      Object.assign(acc, flatten(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    return acc;
  }, {});
}

// 辅助函数：判断是否为对象
function isObject(item: any): boolean {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}