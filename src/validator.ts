/**
 * 验证工具函数
 */

/**
 * 验证邮箱
 * @param email 邮箱字符串
 * @returns 是否为有效邮箱
 * @example
 * isEmail('test@example.com') // => true
 * isEmail('invalid-email') // => false
 */
export function isEmail(email: string): boolean {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

/**
 * 验证URL
 * @param url URL字符串
 * @returns 是否为有效URL
 * @example
 * isURL('https://example.com') // => true
 * isURL('invalid-url') // => false
 */
export function isURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 验证手机号（中国大陆）
 * @param phoneNumber 手机号字符串
 * @returns 是否为有效手机号
 * @example
 * isPhoneNumber('13812345678') // => true
 * isPhoneNumber('1381234567') // => false
 */
export function isPhoneNumber(phoneNumber: string): boolean {
  const regex = /^1[3-9]\d{9}$/;
  return regex.test(phoneNumber);
}

/**
 * 验证身份证号（中国大陆）
 * @param idCard 身份证号字符串
 * @returns 是否为有效身份证号
 * @example
 * isIDCard('110101199001011234') // => true
 * isIDCard('1101011990010112') // => false
 */
export function isIDCard(idCard: string): boolean {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return regex.test(idCard);
}

/**
 * 验证IPv4地址
 * @param ip IPv4地址字符串
 * @returns 是否为有效IPv4地址
 * @example
 * isIPv4('192.168.1.1') // => true
 * isIPv4('256.0.0.1') // => false
 */
export function isIPv4(ip: string): boolean {
  const regex = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)(\.(25[0-5]|2[0-4]\d|[01]?\d\d?)){3}$/;
  return regex.test(ip);
}

/**
 * 验证是否为空值
 * @param value 任意值
 * @returns 是否为空值（null、undefined、空字符串、空数组、空对象）
 * @example
 * isEmpty(null) // => true
 * isEmpty('') // => true
 * isEmpty([]) // => true
 * isEmpty({}) // => true
 * isEmpty('text') // => false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
}

/**
 * 验证是否为数字字符串
 * @param str 字符串
 * @returns 是否为数字字符串
 * @example
 * isNumeric('123') // => true
 * isNumeric('12.34') // => true
 * isNumeric('-12.34') // => true
 * isNumeric('abc') // => false
 */
export function isNumeric(str: string): boolean {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
}