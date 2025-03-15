/**
 * 其他工具函数
 */

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param wait 等待时间，单位毫秒，默认300ms
 * @returns 防抖后的函数
 * @example
 * const debouncedFn = debounce(() => console.log('Debounced'), 500);
 * // 多次调用，只会在最后一次调用后500ms执行一次
 * debouncedFn();
 * debouncedFn();
 * debouncedFn(); // 只有这次调用会在500ms后触发
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      fn.apply(context, args);
      timeout = null;
    }, wait);
  };
}

/**
 * 节流函数
 * @param fn 需要节流的函数
 * @param wait 等待时间，单位毫秒，默认300ms
 * @returns 节流后的函数
 * @example
 * const throttledFn = throttle(() => console.log('Throttled'), 500);
 * // 多次调用，每500ms最多执行一次
 * throttledFn();
 * throttledFn(); // 不会执行
 * // 500ms后
 * throttledFn(); // 会执行
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let lastCallTime: number = 0;
  
  return function(this: any, ...args: Parameters<T>): void {
    const now = Date.now();
    const context = this;
    
    if (now - lastCallTime >= wait) {
      fn.apply(context, args);
      lastCallTime = now;
    }
  };
}

/**
 * 延迟执行
 * @param ms 延迟时间，单位毫秒
 * @returns Promise对象
 * @example
 * async function example() {
 *   console.log('Start');
 *   await sleep(1000);
 *   console.log('After 1 second');
 * }
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param fn 需要重试的函数
 * @param options 重试选项
 * @returns 包装后的函数
 * @example
 * const fetchWithRetry = retry(
 *   () => fetch('https://api.example.com/data'),
 *   { retries: 3, delay: 1000 }
 * );
 * fetchWithRetry().then(response => console.log(response));
 */
export function retry<T>(
  fn: () => Promise<T>,
  options: { retries: number; delay?: number }
): () => Promise<T> {
  const { retries = 3, delay = 1000 } = options;
  
  return async function(): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries) {
          await sleep(delay);
        }
      }
    }
    
    throw lastError!;
  };
}

/**
 * 缓存函数结果
 * @param fn 需要缓存结果的函数
 * @returns 包装后的函数
 * @example
 * const expensiveCalculation = (n) => {
 *   console.log('Computing...');
 *   return n * n;
 * };
 * 
 * const memoizedCalculation = memoize(expensiveCalculation);
 * memoizedCalculation(4); // 输出 'Computing...' 并返回 16
 * memoizedCalculation(4); // 直接返回 16，不会输出 'Computing...'
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * 树节点接口
 */
export interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

/**
 * 在树结构中查找节点
 * @param tree 树结构或节点
 * @param predicate 判断函数，返回true表示找到目标节点
 * @returns 找到的节点，未找到返回undefined
 * @example
 * const tree = {
 *   id: 1,
 *   name: 'Root',
 *   children: [
 *     { id: 2, name: 'Child 1' },
 *     { 
 *       id: 3, 
 *       name: 'Child 2',
 *       children: [{ id: 4, name: 'Grandchild' }]
 *     }
 *   ]
 * };
 * 
 * // 查找id为4的节点
 * const node = findNode(tree, node => node.id === 4);
 * console.log(node); // { id: 4, name: 'Grandchild' }
 */
export function findNode<T extends TreeNode>(
  tree: T,
  predicate: (node: TreeNode) => boolean
): TreeNode | undefined {
  // 检查当前节点是否符合条件
  if (predicate(tree)) {
    return tree;
  }
  
  // 如果有子节点，递归查找
  if (tree.children && tree.children.length > 0) {
    for (const child of tree.children) {
      const found = findNode(child, predicate);
      if (found) {
        return found;
      }
    }
  }
  
  // 未找到
  return undefined;
}