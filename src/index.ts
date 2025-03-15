/**
 * @agions/utils
 * 常用的TypeScript工具集合库
 */

// 日期处理模块
export * from './date.js';

// 字符串处理模块
export * from './string.js';

// 数组处理模块 - 先导出重命名函数，再导出整个模块
export { flatten as arrayFlatten } from './array.js';
export * from './array.js';

// 对象处理模块 - 先导出重命名函数，再导出整个模块

// 数学计算模块
export * from './math.js';

// 验证器模块 - 先导出重命名函数，再导出整个模块
export * from './validator.js';

// 其他工具模块
export * from './misc.js';

// 请求模块 - 先导出重命名函数，再导出整个模块
export { get as requestGet } from './request.js';
export * from './request.js';

// 导出命名空间
import * as dateUtils from './date.js';
import * as stringUtils from './string.js';
import * as arrayUtils from './array.js';
import * as objectUtils from './object.js';
import * as mathUtils from './math.js';
import * as validatorUtils from './validator.js';
import * as miscUtils from './misc.js';
import * as requestUtils from './request.js';

// 命名空间导出
export const date = dateUtils;
export const string = stringUtils;
export const array = arrayUtils;
export const object = objectUtils;
export const math = mathUtils;
export const validator = validatorUtils;
export const misc = miscUtils;
export const request = requestUtils;