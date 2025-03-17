/**
 * 插件系统和中间件工具函数
 */

/**
 * 插件接口
 */
export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件初始化函数 */
  install: (app: PluginContext, ...options: any[]) => void;
}

/**
 * 插件上下文接口
 */
export interface PluginContext {
  /** 注册的插件 */
  plugins: Map<string, Plugin>;
  /** 中间件列表 */
  middlewares: Middleware[];
  /** 钩子 */
  hooks: Map<string, Hook[]>;
  /** 应用选项 */
  options: Record<string, any>;
  /** 公共API */
  [key: string]: any;
}

/**
 * 中间件类型
 */
export type Middleware<T = any, R = any> = (data: T, next: (data: T) => R) => R;

/**
 * 钩子函数类型
 */
export type Hook = (...args: any[]) => any;

/**
 * 插件系统实例接口
 */
export interface PluginSystem {
  /** 插件上下文 */
  context: PluginContext;
  /** 注册插件 */
  use: (plugin: Plugin, ...options: any[]) => PluginSystem;
  /** 注册中间件 */
  useMiddleware: <T = any, R = any>(middleware: Middleware<T, R>) => PluginSystem;
  /** 执行中间件链 */
  applyMiddlewares: <T = any, R = any>(initialData: T) => R;
  /** 注册钩子 */
  hook: (name: string, hook: Hook) => PluginSystem;
  /** 执行钩子 */
  callHook: (name: string, ...args: any[]) => any[];
  /** 串行执行钩子 */
  callHookSerial: <T = any>(name: string, initialValue: T) => T;
  /** 获取插件实例 */
  getPlugin: (name: string) => Plugin | undefined;
  /** 扩展上下文API */
  extend: (name: string, value: any) => PluginSystem;
  /** 函数组合 */
  compose: <T = any>(...fns: Array<(arg: T) => T>) => (arg: T) => T;
}

/**
 * 创建插件系统
 * @param options 应用选项
 * @returns 插件系统实例
 * @example
 * const app = createPluginSystem({ debug: true });
 * 
 * // 注册插件
 * app.use({
 *   name: 'logger',
 *   install(app) {
 *     app.log = (...args) => {
 *       if (app.options.debug) {
 *         console.log('[Logger]', ...args);
 *       }
 *     };
 *     
 *     // 注册钩子
 *     app.hook('beforeRequest', (config) => {
 *       app.log('Request:', config);
 *       return config;
 *     });
 *   }
 * });
 * 
 * // 使用钩子
 * app.callHook('beforeRequest', { url: '/api' });
 */
export function createPluginSystem(options: Record<string, any> = {}): PluginSystem {
  const context: PluginContext = {
    plugins: new Map(),
    middlewares: [],
    hooks: new Map(),
    options
  };
  
  const system: PluginSystem = {
    context,
    
    /**
     * 注册插件
     * @param plugin 插件对象
     * @param options 插件选项
     * @returns 插件系统实例
     */
    use(plugin: Plugin, ...options: any[]): PluginSystem {
      if (context.plugins.has(plugin.name)) {
        console.warn(`Plugin "${plugin.name}" is already registered.`);
        return this;
      }
      
      context.plugins.set(plugin.name, plugin);
      plugin.install(context, ...options);
      return this;
    },
    
    /**
     * 注册中间件
     * @param middleware 中间件函数
     * @returns 插件系统实例
     */
    useMiddleware<T = any, R = any>(middleware: Middleware<T, R>): PluginSystem {
      context.middlewares.push(middleware);
      return this;
    },
    
    /**
     * 执行中间件链
     * @param initialData 初始数据
     * @returns 处理后的数据
     */
    applyMiddlewares<T = any, R = any>(initialData: T): R {
      const middlewares = [...context.middlewares];
      
      function dispatch(index: number, data: T): R {
        if (index >= middlewares.length) {
          return data as unknown as R;
        }
        
        const middleware = middlewares[index];
        return middleware(data, (nextData) => dispatch(index + 1, nextData));
      }
      
      return dispatch(0, initialData);
    },
    
    /**
     * 注册钩子
     * @param name 钩子名称
     * @param hook 钩子函数
     * @returns 插件系统实例
     */
    hook(name: string, hook: Hook): PluginSystem {
      if (!context.hooks.has(name)) {
        context.hooks.set(name, []);
      }
      
      context.hooks.get(name)!.push(hook);
      return this;
    },
    
    /**
     * 执行钩子
     * @param name 钩子名称
     * @param args 钩子参数
     * @returns 所有钩子函数的返回值数组
     */
    callHook(name: string, ...args: any[]): any[] {
      const hooks = context.hooks.get(name) || [];
      return hooks.map(hook => hook(...args));
    },
    
    /**
     * 串行执行钩子
     * @param name 钩子名称
     * @param initialValue 初始值
     * @returns 最终处理结果
     */
    callHookSerial<T = any>(name: string, initialValue: T): T {
      const hooks = context.hooks.get(name) || [];
      
      return hooks.reduce((result, hook) => {
        return hook(result);
      }, initialValue);
    },
    
    /**
     * 获取插件实例
     * @param name 插件名称
     * @returns 插件实例
     */
    getPlugin(name: string): Plugin | undefined {
      return context.plugins.get(name);
    },
    
    /**
     * 扩展上下文API
     * @param name API名称
     * @param value API实现
     * @returns 插件系统实例
     */
    extend(name: string, value: any): PluginSystem {
      if (name in context) {
        console.warn(`API "${name}" already exists. Overwriting it may cause unexpected behavior.`);
      }
      
      context[name] = value;
      return this;
    },
    
    /**
     * 函数组合
     * @param fns 要组合的函数数组
     * @returns 组合后的函数
     */
    compose<T = any>(...fns: Array<(arg: T) => T>): (arg: T) => T {
      if (fns.length === 0) {
        return (arg) => arg;
      }
      
      if (fns.length === 1) {
        return fns[0];
      }
      
      return fns.reduce((a, b) => (arg) => a(b(arg)));
    }
  };
  
  return system;
}

/**
 * 创建适配器
 * @param adapter 适配器实现
 * @returns 适配后的函数
 * @example
 * const localStorageAdapter = createAdapter({
 *   get: (key) => localStorage.getItem(key),
 *   set: (key, value) => localStorage.setItem(key, value),
 *   remove: (key) => localStorage.removeItem(key)
 * });
 * 
 * // 使用适配器
 * const storage = localStorageAdapter;
 * storage.set('name', 'John');
 * console.log(storage.get('name')); // John
 */
export function createAdapter<T extends object>(adapter: T): T {
  return Object.freeze({ ...adapter });
}

/**
 * 函数组合
 * @param fns 要组合的函数数组
 * @returns 组合后的函数
 * @example
 * const add10 = (x) => x + 10;
 * const multiply2 = (x) => x * 2;
 * const subtract5 = (x) => x - 5;
 * 
 * const calculate = pipe(add10, multiply2, subtract5);
 * console.log(calculate(5)); // ((5 + 10) * 2) - 5 = 25
 */
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  if (fns.length === 0) {
    return (arg) => arg;
  }
  
  if (fns.length === 1) {
    return fns[0];
  }
  
  return fns.reduce((a, b) => (arg) => b(a(arg)));
}

/**
 * 函数组合（从右到左）
 * @param fns 要组合的函数数组
 * @returns 组合后的函数
 * @example
 * const add10 = (x) => x + 10;
 * const multiply2 = (x) => x * 2;
 * const subtract5 = (x) => x - 5;
 * 
 * const calculate = compose(subtract5, multiply2, add10);
 * console.log(calculate(5)); // subtract5(multiply2(add10(5))) = (((5 + 10) * 2) - 5) = 25
 */
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  if (fns.length === 0) {
    return (arg) => arg;
  }
  
  if (fns.length === 1) {
    return fns[0];
  }
  
  return fns.reduce((a, b) => (arg) => a(b(arg)));
} 