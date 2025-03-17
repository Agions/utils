/**
 * 响应式数据处理工具函数
 */

/**
 * 事件类型
 */
export type ReactiveEvent = 'get' | 'set' | 'delete';

/**
 * 监听器函数类型
 */
export type ReactiveListener = (
  event: ReactiveEvent,
  path: string[],
  value?: any,
  oldValue?: any
) => void;

/**
 * 创建响应式对象
 * @param target 目标对象
 * @param listener 监听器函数
 * @param path 当前属性路径
 * @returns 响应式代理对象
 * @example
 * const state = reactive({ count: 0, user: { name: 'John' } }, 
 *   (event, path, value, oldValue) => {
 *     console.log(`${event} ${path.join('.')} ${value}`);
 *   }
 * );
 * state.count++; // 输出: set count 1
 * state.user.name = 'Jane'; // 输出: set user.name Jane
 */
export function reactive<T extends object>(
  target: T,
  listener: ReactiveListener,
  path: string[] = []
): T {
  return new Proxy(target, {
    get(obj, key) {
      const propertyKey = String(key);
      const currentPath = [...path, propertyKey];
      
      listener('get', currentPath, obj[key as keyof typeof obj]);
      
      const value = obj[key as keyof typeof obj];
      
      if (value && typeof value === 'object') {
        return reactive(value, listener, currentPath);
      }
      
      return value;
    },
    
    set(obj, key, value) {
      const propertyKey = String(key);
      const currentPath = [...path, propertyKey];
      const oldValue = obj[key as keyof typeof obj];
      
      if (oldValue !== value) {
        obj[key as keyof typeof obj] = value;
        listener('set', currentPath, value, oldValue);
      }
      
      return true;
    },
    
    deleteProperty(obj, key) {
      const propertyKey = String(key);
      const currentPath = [...path, propertyKey];
      const oldValue = obj[key as keyof typeof obj];
      
      const result = delete obj[key as keyof typeof obj];
      
      if (result) {
        listener('delete', currentPath, undefined, oldValue);
      }
      
      return result;
    }
  });
}

/**
 * 创建计算属性
 * @param getter 获取计算值的函数
 * @returns 计算属性对象
 * @example
 * const state = reactive({ count: 0 });
 * const doubleCount = computed(() => state.count * 2);
 * console.log(doubleCount.value); // 0
 * state.count = 2;
 * console.log(doubleCount.value); // 4
 */
export function computed<T>(getter: () => T): { readonly value: T } {
  let value: T;
  let dirty = true;
  
  return Object.defineProperties({}, {
    value: {
      get() {
        if (dirty) {
          value = getter();
          dirty = false;
        }
        return value;
      },
      enumerable: true
    }
  }) as { readonly value: T };
}

/**
 * 创建可监听的状态值
 * @param initialValue 初始值
 * @returns 可监听的状态对象和更新函数
 * @example
 * const [count, setCount] = state(0);
 * console.log(count.value); // 0
 * setCount(1);
 * console.log(count.value); // 1
 * setCount(prev => prev + 1);
 * console.log(count.value); // 2
 */
export function state<T>(initialValue: T): [{ readonly value: T }, (newValue: T | ((prev: T) => T)) => void] {
  let value = initialValue;
  
  const state = {
    get value() {
      return value;
    }
  };
  
  const setState = (newValue: T | ((prev: T) => T)) => {
    if (typeof newValue === 'function') {
      value = (newValue as (prev: T) => T)(value);
    } else {
      value = newValue;
    }
  };
  
  return [state, setState];
}

/**
 * 创建观察者模式的事件总线
 * @returns 事件总线对象
 * @example
 * const events = eventBus();
 * events.on('change', (data) => console.log('Changed:', data));
 * events.emit('change', { count: 1 }); // 输出: Changed: {count: 1}
 */
export function eventBus<T = any>() {
  const listeners: Record<string, Array<(data: T) => void>> = {};
  
  return {
    /**
     * 订阅事件
     * @param event 事件名
     * @param callback 回调函数
     */
    on(event: string, callback: (data: T) => void) {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
      
      return () => this.off(event, callback);
    },
    
    /**
     * 取消订阅事件
     * @param event 事件名
     * @param callback 回调函数
     */
    off(event: string, callback: (data: T) => void) {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    },
    
    /**
     * 发布事件
     * @param event 事件名
     * @param data 事件数据
     */
    emit(event: string, data: T) {
      if (listeners[event]) {
        listeners[event].forEach(callback => callback(data));
      }
    }
  };
} 