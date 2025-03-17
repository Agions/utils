/**
 * @agions/utils
 * 常用的TypeScript工具集合库
 */

// 导入所有模块作为命名空间
import * as dateUtils from './date';
import * as stringUtils from './string';
import * as arrayUtils from './array';
import * as objectUtils from './object';
import * as mathUtils from './math';
import * as validatorUtils from './validator';
import * as miscUtils from './misc';
import * as requestUtils from './request';
import * as performanceUtils from './performance';
import * as reactiveUtils from './reactive';
import * as i18nUtils from './i18n';
import * as pluginUtils from './plugin';
import * as cryptoUtils from './crypto';
import * as formUtils from './form';
import * as uiUtils from './ui';
import * as fileUtils from './file';
import * as transformUtils from './transform';

// 命名空间导出
export const date = dateUtils;
export const string = stringUtils;
export const array = arrayUtils;
export const object = objectUtils;
export const math = mathUtils;
export const validator = validatorUtils;
export const misc = miscUtils;
export const request = requestUtils;
export const performance = performanceUtils;
export const reactive = reactiveUtils;
export const i18n = i18nUtils;
export const plugin = pluginUtils;
export const crypto = cryptoUtils;
export const form = formUtils;
export const ui = uiUtils;
export const file = fileUtils;
export const transform = transformUtils;