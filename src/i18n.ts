/**
 * 国际化工具函数
 */

/**
 * 语言资源类型
 */
export type LocaleResources = Record<string, Record<string, string | Record<string, string>>>;

/**
 * 国际化选项
 */
export interface I18nOptions {
  /** 当前语言 */
  locale: string;
  /** 默认语言 */
  fallbackLocale?: string;
  /** 语言资源 */
  resources: LocaleResources;
  /** 插值选项 */
  interpolation?: {
    /** 插值前缀 */
    prefix?: string;
    /** 插值后缀 */
    suffix?: string;
  };
}

/**
 * 创建国际化实例
 * @param options 国际化选项
 * @returns 国际化实例
 * @example
 * const i18n = createI18n({
 *   locale: 'zh-CN',
 *   fallbackLocale: 'en',
 *   resources: {
 *     'en': {
 *       messages: {
 *         hello: 'Hello, {name}!',
 *         welcome: 'Welcome'
 *       }
 *     },
 *     'zh-CN': {
 *       messages: {
 *         hello: '你好，{name}！',
 *         welcome: '欢迎'
 *       }
 *     }
 *   }
 * });
 * 
 * i18n.t('messages.hello', { name: '张三' }); // 你好，张三！
 * i18n.setLocale('en');
 * i18n.t('messages.hello', { name: 'John' }); // Hello, John!
 */
export function createI18n(options: I18nOptions) {
  let currentLocale = options.locale;
  const fallbackLocale = options.fallbackLocale || options.locale;
  const resources = options.resources;
  const interpolation = options.interpolation || { prefix: '{', suffix: '}' };
  const prefix = interpolation.prefix || '{';
  const suffix = interpolation.suffix || '}';
  
  /**
   * 获取翻译内容
   * @param key 翻译键
   * @param params 插值参数
   * @returns 翻译结果
   */
  function t(key: string, params: Record<string, any> = {}): string {
    const keys = key.split('.');
    const namespace = keys.length > 1 ? keys[0] : '';
    const messageKey = keys.length > 1 ? keys.slice(1).join('.') : key;
    
    const getMessage = (locale: string, ns: string, msgKey: string): string | undefined => {
      if (!resources[locale]) return undefined;
      
      const nsObj = ns ? resources[locale][ns] : resources[locale];
      if (!nsObj || typeof nsObj !== 'object') return undefined;
      
      const parts = msgKey.split('.');
      let current = nsObj as any;
      
      for (let i = 0; i < parts.length; i++) {
        if (current[parts[i]] === undefined) return undefined;
        current = current[parts[i]];
      }
      
      return typeof current === 'string' ? current : undefined;
    };
    
    // 尝试从当前语言获取
    let message = getMessage(currentLocale, namespace, messageKey);
    
    // 如果找不到，尝试从回退语言获取
    if (message === undefined && fallbackLocale !== currentLocale) {
      message = getMessage(fallbackLocale, namespace, messageKey);
    }
    
    // 如果仍然找不到，返回键名
    if (message === undefined) {
      return key;
    }
    
    // 处理插值
    return message.replace(new RegExp(`${prefix}(\\w+)${suffix}`, 'g'), (_, paramKey) => {
      return params[paramKey] !== undefined ? String(params[paramKey]) : `${prefix}${paramKey}${suffix}`;
    });
  }
  
  /**
   * 设置当前语言
   * @param locale 语言代码
   */
  function setLocale(locale: string): void {
    if (resources[locale]) {
      currentLocale = locale;
    } else {
      console.warn(`Locale "${locale}" not found, fallback to "${currentLocale}"`);
    }
  }
  
  /**
   * 获取当前语言
   * @returns 当前语言代码
   */
  function getLocale(): string {
    return currentLocale;
  }
  
  /**
   * 获取可用语言列表
   * @returns 可用语言代码数组
   */
  function getLocales(): string[] {
    return Object.keys(resources);
  }
  
  /**
   * 检查翻译键是否存在
   * @param key 翻译键
   * @returns 是否存在
   */
  function exists(key: string): boolean {
    const keys = key.split('.');
    const namespace = keys.length > 1 ? keys[0] : '';
    const messageKey = keys.length > 1 ? keys.slice(1).join('.') : key;
    
    const getMessage = (locale: string, ns: string, msgKey: string): boolean => {
      if (!resources[locale]) return false;
      
      const nsObj = ns ? resources[locale][ns] : resources[locale];
      if (!nsObj || typeof nsObj !== 'object') return false;
      
      const parts = msgKey.split('.');
      let current = nsObj as any;
      
      for (let i = 0; i < parts.length; i++) {
        if (current[parts[i]] === undefined) return false;
        current = current[parts[i]];
      }
      
      return typeof current === 'string';
    };
    
    return getMessage(currentLocale, namespace, messageKey) || 
      (fallbackLocale !== currentLocale && getMessage(fallbackLocale, namespace, messageKey));
  }
  
  return {
    t,
    setLocale,
    getLocale,
    getLocales,
    exists
  };
}

/**
 * 处理复数形式
 * @param count 数量
 * @param forms 复数形式数组
 * @returns 对应的复数形式
 * @example
 * // 中文示例
 * plural(0, ['没有项目', '{n}个项目']); // 没有项目
 * plural(1, ['没有项目', '{n}个项目']); // 1个项目
 * 
 * // 英文示例
 * plural(0, ['no items', '{n} item', '{n} items']); // no items
 * plural(1, ['no items', '{n} item', '{n} items']); // 1 item
 * plural(2, ['no items', '{n} item', '{n} items']); // 2 items
 */
export function plural(count: number, forms: string[]): string {
  if (forms.length === 0) return '';
  
  if (count === 0 && forms.length > 2) {
    return forms[0].replace('{n}', count.toString());
  }
  
  if (count === 1 && forms.length > 1) {
    return forms[1].replace('{n}', count.toString());
  }
  
  const form = forms[Math.min(forms.length - 1, count === 0 ? 0 : 2)];
  return form.replace('{n}', count.toString());
}

/**
 * 日期本地化
 * @param date 日期对象或时间戳
 * @param locale 语言代码
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'zh-CN', { dateStyle: 'full' }); // 2023年10月1日 星期日
 * formatDate(new Date(), 'en', { dateStyle: 'full' }); // Sunday, October 1, 2023
 */
export function formatDate(
  date: Date | number,
  locale?: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * 数字本地化
 * @param number 数字
 * @param locale 语言代码
 * @param options 格式化选项
 * @returns 格式化后的数字字符串
 * @example
 * formatNumber(1234.56, 'zh-CN'); // 1,234.56
 * formatNumber(1234.56, 'en-US', { style: 'currency', currency: 'USD' }); // $1,234.56
 */
export function formatNumber(
  number: number,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number);
}

/**
 * 相对时间格式化
 * @param date 日期对象或时间戳
 * @param locale 语言代码
 * @param options 格式化选项
 * @returns 格式化后的相对时间字符串
 * @example
 * formatRelativeTime(Date.now() - 5 * 60 * 1000, 'zh-CN'); // 5分钟前
 * formatRelativeTime(Date.now() - 1 * 60 * 60 * 1000, 'en'); // 1 hour ago
 */
export function formatRelativeTime(
  date: Date | number,
  locale?: string,
  options?: Intl.RelativeTimeFormatOptions
): string {
  const dateTimestamp = typeof date === 'number' ? date : date.getTime();
  const now = Date.now();
  const diffInSeconds = Math.floor((now - dateTimestamp) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, options);
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
} 