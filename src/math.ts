/**
 * 数学计算工具函数
 */

/**
 * 四舍五入
 * @param num 输入数字
 * @param precision 精度，小数点后位数，默认为0
 * @returns 四舍五入后的数字
 * @example
 * round(1.2345, 2) // => 1.23
 * round(1.2345, 0) // => 1
 */
export function round(num: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

/**
 * 向下取整
 * @param num 输入数字
 * @param precision 精度，小数点后位数，默认为0
 * @returns 向下取整后的数字
 * @example
 * floor(1.2345, 2) // => 1.23
 * floor(1.2345, 0) // => 1
 */
export function floor(num: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.floor(num * factor) / factor;
}

/**
 * 向上取整
 * @param num 输入数字
 * @param precision 精度，小数点后位数，默认为0
 * @returns 向上取整后的数字
 * @example
 * ceil(1.2345, 2) // => 1.24
 * ceil(1.2345, 0) // => 2
 */
export function ceil(num: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.ceil(num * factor) / factor;
}

/**
 * 生成随机数
 * @param min 最小值，默认为0
 * @param max 最大值，默认为1
 * @param isInteger 是否为整数，默认为false
 * @returns 随机数
 * @example
 * random(1, 10) // => 5.123456789
 * random(1, 10, true) // => 5
 */
export function random(min: number = 0, max: number = 1, isInteger: boolean = false): number {
  const result = Math.random() * (max - min) + min;
  return isInteger ? Math.floor(result) : result;
}

/**
 * 限制数值范围
 * @param num 输入数字
 * @param min 最小值
 * @param max 最大值
 * @returns 限制范围后的数字
 * @example
 * clamp(5, 1, 10) // => 5
 * clamp(0, 1, 10) // => 1
 * clamp(11, 1, 10) // => 10
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * 计算中位数
 * @param numbers 数字数组
 * @returns 中位数
 * @example
 * median([1, 3, 5, 7, 9]) // => 5
 * median([1, 3, 5, 7]) // => 4
 */
export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * 计算众数
 * @param numbers 数字数组
 * @returns 众数数组（可能有多个众数）
 * @example
 * mode([1, 2, 2, 3, 3, 3, 4]) // => [3]
 * mode([1, 1, 2, 2]) // => [1, 2]
 */
export function mode(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  
  const counts = new Map<number, number>();
  let maxCount = 0;
  
  // 计算每个数字出现的次数
  for (const num of numbers) {
    const count = (counts.get(num) || 0) + 1;
    counts.set(num, count);
    maxCount = Math.max(maxCount, count);
  }
  
  // 找出出现次数等于最大次数的数字
  return Array.from(counts.entries())
    .filter(([_, count]) => count === maxCount)
    .map(([num]) => num);
}

/**
 * 计算标准差
 * @param numbers 数字数组
 * @param isSample 是否为样本标准差，默认为true
 * @returns 标准差
 * @example
 * standardDeviation([1, 2, 3, 4, 5]) // => 1.5811388300841898
 */
export function standardDeviation(numbers: number[], isSample: boolean = true): number {
  if (numbers.length <= 1) return 0;
  
  const avg = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squareDiffs = numbers.map(num => Math.pow(num - avg, 2));
  const variance = squareDiffs.reduce((sum, diff) => sum + diff, 0) / 
    (isSample ? numbers.length - 1 : numbers.length);
  
  return Math.sqrt(variance);
}

/**
 * 计算百分位数
 * @param numbers 数字数组
 * @param percentile 百分位（0-100）
 * @returns 百分位数值
 * @example
 * percentile([1, 2, 3, 4, 5], 75) // => 4
 */
export function percentile(numbers: number[], percentile: number): number {
  if (numbers.length === 0) return 0;
  if (percentile < 0 || percentile > 100) {
    throw new Error('Percentile must be between 0 and 100');
  }
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const floor = Math.floor(index);
  
  if (floor === index) return sorted[index];
  
  const fraction = index - floor;
  return sorted[floor] + fraction * (sorted[floor + 1] - sorted[floor]);
}

/**
 * 计算指数增长
 * @param initial 初始值
 * @param rate 增长率（小数形式，如0.05表示5%）
 * @param periods 周期数
 * @returns 增长后的值
 * @example
 * exponentialGrowth(1000, 0.05, 5) // => 1276.2815625000003
 */
export function exponentialGrowth(initial: number, rate: number, periods: number): number {
  return initial * Math.pow(1 + rate, periods);
}

/**
 * 计算对数增长
 * @param initial 初始值
 * @param rate 增长率（小数形式）
 * @param periods 周期数
 * @returns 增长后的值
 * @example
 * logarithmicGrowth(1000, 0.5, 5) // => 1500
 */
export function logarithmicGrowth(initial: number, rate: number, periods: number): number {
  return initial * (1 + rate * Math.log(periods + 1));
}

/**
 * 计算复利
 * @param principal 本金
 * @param rate 年利率（小数形式，如0.05表示5%）
 * @param time 时间（年）
 * @param frequency 复利频率（每年几次，默认为1）
 * @returns 最终金额
 * @example
 * compound(1000, 0.05, 5) // => 1276.2815625000003
 * compound(1000, 0.05, 5, 12) // => 1283.3587600246554 (月复利)
 */
export function compound(principal: number, rate: number, time: number, frequency: number = 1): number {
  return principal * Math.pow(1 + rate / frequency, frequency * time);
}