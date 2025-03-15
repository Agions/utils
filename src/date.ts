/**
 * 日期处理工具函数
 */

/**
 * 格式化日期
 * @param date 日期对象
 * @param format 格式化字符串，支持YYYY(年)、MM(月)、DD(日)、HH(时)、mm(分)、ss(秒)
 * @returns 格式化后的日期字符串
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD') // => '2023-04-01'
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hours.toString().padStart(2, '0'))
    .replace('mm', minutes.toString().padStart(2, '0'))
    .replace('ss', seconds.toString().padStart(2, '0'));
}

/**
 * 判断是否为闰年
 * @param year 年份
 * @returns 是否为闰年
 * @example
 * isLeapYear(2020) // => true
 * isLeapYear(2021) // => false
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取月份天数
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 月份天数
 * @example
 * getDaysInMonth(2023, 2) // => 28
 * getDaysInMonth(2020, 2) // => 29
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * 添加天数
 * @param date 日期对象
 * @param days 天数
 * @returns 新的日期对象
 * @example
 * addDays(new Date('2023-04-01'), 5) // => new Date('2023-04-06')
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * 计算两个日期之间的天数差
 * @param date1 日期对象1
 * @param date2 日期对象2
 * @returns 天数差
 * @example
 * diffDays(new Date('2023-04-01'), new Date('2023-04-05')) // => 4
 */
export function diffDays(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const diffTime = Math.abs(time2 - time1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 比较两个日期
 * @param date1 日期对象1
 * @param date2 日期对象2
 * @returns 比较结果：-1表示date1早于date2，0表示相等，1表示date1晚于date2
 * @example
 * compareDate(new Date('2023-04-01'), new Date('2023-04-05')) // => -1
 * compareDate(new Date('2023-04-05'), new Date('2023-04-01')) // => 1
 * compareDate(new Date('2023-04-01'), new Date('2023-04-01')) // => 0
 */
export function compareDate(date1: Date, date2: Date): -1 | 0 | 1 {
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  
  if (time1 < time2) return -1;
  if (time1 > time2) return 1;
  return 0;
}

/**
 * 添加月份
 * @param date 日期对象
 * @param months 月数
 * @returns 新的日期对象
 * @example
 * addMonths(new Date('2023-04-01'), 2) // => new Date('2023-06-01')
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * 添加年份
 * @param date 日期对象
 * @param years 年数
 * @returns 新的日期对象
 * @example
 * addYears(new Date('2023-04-01'), 1) // => new Date('2024-04-01')
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * 获取日期是一周中的第几天
 * @param date 日期对象
 * @param startOnMonday 是否从周一开始计算，默认为false（从周日开始）
 * @returns 一周中的第几天（0-6）
 * @example
 * getDayOfWeek(new Date('2023-04-02')) // => 0 (周日)
 * getDayOfWeek(new Date('2023-04-03')) // => 1 (周一)
 * getDayOfWeek(new Date('2023-04-03'), true) // => 0 (周一，从周一开始计算)
 */
export function getDayOfWeek(date: Date, startOnMonday: boolean = false): number {
  let day = date.getDay();
  if (startOnMonday) {
    day = day === 0 ? 6 : day - 1;
  }
  return day;
}

/**
 * 获取两个日期之间的所有日期
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 日期数组
 * @example
 * getDatesBetween(new Date('2023-04-01'), new Date('2023-04-03'))
 * // => [new Date('2023-04-01'), new Date('2023-04-02'), new Date('2023-04-03')]
 */
export function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * 计算两个日期之间的小时差
 * @param date1 日期对象1
 * @param date2 日期对象2
 * @returns 小时差
 * @example
 * diffHours(new Date('2023-04-01T08:00:00'), new Date('2023-04-01T12:00:00')) // => 4
 */
export function diffHours(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const diffTime = Math.abs(time2 - time1);
  return Math.floor(diffTime / (1000 * 60 * 60));
}

/**
 * 计算两个日期之间的分钟差
 * @param date1 日期对象1
 * @param date2 日期对象2
 * @returns 分钟差
 * @example
 * diffMinutes(new Date('2023-04-01T08:00:00'), new Date('2023-04-01T08:30:00')) // => 30
 */
export function diffMinutes(date1: Date, date2: Date): number {
  const time1 = date1.getTime();
  const time2 = date2.getTime();
  const diffTime = Math.abs(time2 - time1);
  return Math.floor(diffTime / (1000 * 60));
}

/**
 * 将日期转换为相对时间描述（中文）
 * @param date 日期对象
 * @returns 相对时间描述
 * @example
 * formatTimeAgo(new Date(Date.now() - 3000)) // => '3秒前'
 * formatTimeAgo(new Date(Date.now() - 3600000)) // => '1小时前'
 * formatTimeAgo(new Date('2023-03-15')) // => '3月15日'（当超过3天时）
 */
export function formatTimeAgo(date: Date, now: Date = new Date()): string {
  const diff = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 3) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    if (year !== now.getFullYear()) {
      return `${year}年${month}月${day}日`;
    }
    return `${month}月${day}日`;
  }

  if (days > 0) return `${days}天前`;
  if (hours > 0) return `${hours}小时前`;
  if (minutes > 0) return `${minutes}分钟前`;
  if (seconds > 0) return `${seconds}秒前`;
  
  return '刚刚';
}

/**
 * 获取日期的开始时间（00:00:00）
 * @param date 日期对象
 * @returns 日期的开始时间
 * @example
 * startOfDay(new Date('2023-04-01T12:30:45')) // => new Date('2023-04-01T00:00:00')
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取日期的结束时间（23:59:59.999）
 * @param date 日期对象
 * @returns 日期的结束时间
 * @example
 * endOfDay(new Date('2023-04-01T12:30:45')) // => new Date('2023-04-01T23:59:59.999')
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 获取月份的开始日期
 * @param date 日期对象
 * @returns 月份的开始日期
 * @example
 * startOfMonth(new Date('2023-04-15')) // => new Date('2023-04-01T00:00:00')
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 获取月份的结束日期
 * @param date 日期对象
 * @returns 月份的结束日期
 * @example
 * endOfMonth(new Date('2023-04-15')) // => new Date('2023-04-30T23:59:59.999')
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 解析日期字符串
 * @param dateStr 日期字符串
 * @param format 格式字符串，支持YYYY(年)、MM(月)、DD(日)、HH(时)、mm(分)、ss(秒)
 * @returns 日期对象，解析失败返回null
 * @example
 * parseDate('2023-04-01', 'YYYY-MM-DD') // => new Date('2023-04-01')
 */
export function parseDate(dateStr: string, format: string = 'YYYY-MM-DD'): Date | null {
  const patterns = {
    YYYY: '(\\d{4})',
    MM: '(\\d{1,2})',
    DD: '(\\d{1,2})',
    HH: '(\\d{1,2})',
    mm: '(\\d{1,2})',
    ss: '(\\d{1,2})'
  };
  
  let regexStr = format.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keys: string[] = [];
  
  // 替换格式占位符为正则表达式并收集键
  Object.entries(patterns).forEach(([key, pattern]) => {
    if (format.includes(key)) {
      regexStr = regexStr.replace(key, pattern);
      keys.push(key);
    }
  });
  
  const regex = new RegExp(`^${regexStr}$`);
  const match = dateStr.match(regex);
  
  if (!match) return null;
  
  const values: Record<string, number> = {};
  keys.forEach((key, index) => {
    values[key] = parseInt(match[index + 1], 10);
  });
  
  const year = values.YYYY || new Date().getFullYear();
  const month = values.MM ? values.MM - 1 : 0;
  const day = values.DD || 1;
  const hour = values.HH || 0;
  const minute = values.mm || 0;
  const second = values.ss || 0;
  
  const date = new Date(year, month, day, hour, minute, second);
  return date;
}