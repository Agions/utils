/**
 * 字符串处理工具函数
 */

/**
 * 去除字符串两端空格
 * @param str 输入字符串
 * @returns 处理后的字符串
 * @example
 * trim('  Hello World  ') // => 'Hello World'
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 * @example
 * capitalize('hello') // => 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 转换为驼峰命名
 * @param str 输入字符串
 * @returns 驼峰命名的字符串
 * @example
 * camelCase('hello-world') // => 'helloWorld'
 * camelCase('hello_world') // => 'helloWorld'
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

/**
 * 转换为短横线命名
 * @param str 输入字符串
 * @returns 短横线命名的字符串
 * @example
 * kebabCase('helloWorld') // => 'hello-world'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 转换为下划线命名
 * @param str 输入字符串
 * @returns 下划线命名的字符串
 * @example
 * snakeCase('helloWorld') // => 'hello_world'
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * 截断字符串
 * @param str 输入字符串
 * @param length 截断长度
 * @param suffix 截断后缀，默认为'...'
 * @returns 截断后的字符串
 * @example
 * truncate('Hello World', 5) // => 'Hello...'
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

/**
 * 解析模板字符串
 * @param template 模板字符串，使用 ${key} 作为占位符
 * @param data 数据对象
 * @returns 解析后的字符串
 * @example
 * parseTemplate('Hello, ${name}!', { name: 'World' }) // => 'Hello, World!'
 */
export function parseTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\${([^}]+)}/g, (match, key) => {
    return data[key] !== undefined ? String(data[key]) : match;
  });
}

/**
 * 转义HTML特殊字符
 * @param html HTML字符串
 * @returns 转义后的字符串
 * @example
 * escapeHtml('<div>Hello & World</div>') // => '&lt;div&gt;Hello &amp; World&lt;/div&gt;'
 */
export function escapeHtml(html: string): string {
  const entityMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return html.replace(/[&<>"'\/]/g, (s) => entityMap[s]);
}

/**
 * 反转义HTML特殊字符
 * @param text 转义后的HTML字符串
 * @returns 原始HTML字符串
 * @example
 * unescapeHtml('&lt;div&gt;Hello &amp; World&lt;/div&gt;') // => '<div>Hello & World</div>'
 */
export function unescapeHtml(text: string): string {
  const entityMap: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  };
  
  return text.replace(/&(amp|lt|gt|quot|#39|#x2F);/g, (match) => entityMap[match] || match);
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度，默认为16
 * @param chars 可选字符集，默认为字母和数字
 * @returns 随机字符串
 * @example
 * randomString(8) // => 'a1b2c3d4'
 */
export function randomString(length: number = 16, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  const charsLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  
  return result;
}

/**
 * 格式化数字为千分位分隔的字符串
 * @param num 数字
 * @param options 格式化选项
 * @returns 格式化后的字符串
 * @example
 * formatNumber(1234567.89) // => '1,234,567.89'
 * formatNumber(1234567.89, { decimal: 0 }) // => '1,234,568'
 * formatNumber(1234567.89, { decimal: 2, separator: '.' }) // => '1.234.567,89'
 */
export function formatNumber(num: number, options?: { decimal?: number; separator?: string; decimalSeparator?: string }): string {
  const { decimal = 2, separator = ',', decimalSeparator = '.' } = options || {};
  
  const parts = num.toFixed(decimal).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  
  return parts.join(decimalSeparator);
}

/**
 * 将字符串转换为URL友好的slug
 * @param str 输入字符串
 * @returns slug字符串
 * @example
 * slugify('Hello World!') // => 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除非单词字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除首尾连字符
}