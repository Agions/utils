/**
 * 性能优化工具函数
 */

/**
 * 函数记忆化高阶函数
 * @param fn 需要记忆化的函数
 * @param resolver 可选参数，用于生成缓存键的函数
 * @returns 记忆化后的函数
 * @example
 * const memoizedFib = memoize((n) => n <= 1 ? n : memoizedFib(n - 1) + memoizedFib(n - 2));
 * memoizedFib(40); // 很快，不会重复计算
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 惰性加载函数
 * @param factory 工厂函数，返回实际需要的函数
 * @returns 惰性加载的函数
 * @example
 * const getEnvironment = lazyLoad(() => {
 *   // 复杂的环境检测逻辑，只会在首次调用时执行
 *   const isBrowser = typeof window !== 'undefined';
 *   return () => isBrowser ? 'browser' : 'node';
 * });
 */
export function lazyLoad<T extends (...args: any[]) => any>(factory: () => T): T {
  let initialized = false;
  let fn: T;
  
  return ((...args: any[]) => {
    if (!initialized) {
      fn = factory();
      initialized = true;
    }
    return fn(...args);
  }) as T;
}

/**
 * 节流函数 - 限制函数的执行频率
 * @param fn 需要节流的函数
 * @param wait 等待时间（毫秒）
 * @returns 节流后的函数
 * @example
 * const throttledScroll = throttle(() => console.log('滚动事件'), 300);
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = wait - (now - lastCallTime);
    
    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastCallTime = Date.now();
        timer = null;
        fn.apply(this, args);
      }, remaining);
    }
  };
}

/**
 * 防抖函数 - 延迟函数的执行
 * @param fn 需要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param immediate 是否立即执行
 * @returns 防抖后的函数
 * @example
 * const debouncedSearch = debounce((query) => fetchResults(query), 300);
 * searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  wait: number, 
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const callNow = immediate && !timer;
    
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, wait);
    
    if (callNow) {
      fn.apply(this, args);
    }
  };
}

/**
 * 内联缓存 - 为对象属性访问提供缓存
 * @param obj 目标对象
 * @param propertyName 属性名
 * @param getter 获取器函数
 * @example
 * const userData = { id: 1 };
 * inlineCache(userData, 'fullData', () => fetchUserData(userData.id));
 * userData.fullData; // 首次调用会执行fetchUserData，之后直接返回缓存的结果
 */
export function inlineCache<T extends object, K extends string, V>(
  obj: T, 
  propertyName: K, 
  getter: () => V
): T & Record<K, V> {
  let value: V | undefined;
  let initialized = false;
  
  Object.defineProperty(obj, propertyName, {
    get() {
      if (!initialized) {
        value = getter();
        initialized = true;
      }
      return value;
    },
    enumerable: true,
    configurable: true
  });
  
  return obj as T & Record<K, V>;
} 