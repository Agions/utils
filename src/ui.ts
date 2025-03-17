/**
 * UI/UX 相关工具函数
 */

/**
 * 颜色类型
 */
export type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

/**
 * 将HEX颜色转换为RGB(A)对象
 * @param hex 十六进制颜色值
 * @returns RGB(A)颜色对象
 * @example
 * hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
 * hexToRgb('#ff0000ff'); // { r: 255, g: 0, b: 0, a: 1 }
 */
export function hexToRgb(hex: string): Color {
  // 移除#前缀
  hex = hex.replace(/^#/, '');
  
  // 处理缩写形式 #f00 -> #ff0000
  if (hex.length === 3) {
    hex = hex.split('').map(h => h + h).join('');
  }
  
  // 处理带透明度的HEX #ff0000ff
  let alpha: number | undefined;
  if (hex.length === 8) {
    alpha = parseInt(hex.slice(6, 8), 16) / 255;
    hex = hex.slice(0, 6);
  }
  
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  return alpha !== undefined ? { r, g, b, a: alpha } : { r, g, b };
}

/**
 * 将RGB(A)对象转换为HEX颜色
 * @param color RGB(A)颜色对象
 * @returns 十六进制颜色值
 * @example
 * rgbToHex({ r: 255, g: 0, b: 0 }); // '#ff0000'
 * rgbToHex({ r: 255, g: 0, b: 0, a: 0.5 }); // '#ff000080'
 */
export function rgbToHex(color: Color): string {
  const { r, g, b, a } = color;
  
  // RGB部分
  const hex = [r, g, b]
    .map(x => Math.round(x).toString(16).padStart(2, '0'))
    .join('');
  
  // 透明度部分
  const alphaHex = a !== undefined && a < 1
    ? Math.round(a * 255).toString(16).padStart(2, '0')
    : '';
  
  return `#${hex}${alphaHex}`;
}

/**
 * 将RGB(A)对象转换为CSS颜色字符串
 * @param color RGB(A)颜色对象
 * @returns CSS颜色字符串
 * @example
 * rgbToString({ r: 255, g: 0, b: 0 }); // 'rgb(255, 0, 0)'
 * rgbToString({ r: 255, g: 0, b: 0, a: 0.5 }); // 'rgba(255, 0, 0, 0.5)'
 */
export function rgbToString(color: Color): string {
  const { r, g, b, a } = color;
  
  return a !== undefined && a < 1
    ? `rgba(${r}, ${g}, ${b}, ${a})`
    : `rgb(${r}, ${g}, ${b})`;
}

/**
 * 解析CSS颜色字符串为RGB(A)对象
 * @param color CSS颜色字符串
 * @returns RGB(A)颜色对象
 * @example
 * parseColor('rgb(255, 0, 0)'); // { r: 255, g: 0, b: 0 }
 * parseColor('rgba(255, 0, 0, 0.5)'); // { r: 255, g: 0, b: 0, a: 0.5 }
 * parseColor('#ff0000'); // { r: 255, g: 0, b: 0 }
 */
export function parseColor(color: string): Color {
  // 处理HEX颜色
  if (color.startsWith('#')) {
    return hexToRgb(color);
  }
  
  // 处理rgb/rgba颜色
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    return {
      r: parseInt(r, 10),
      g: parseInt(g, 10),
      b: parseInt(b, 10),
      a: a ? parseFloat(a) : undefined
    };
  }
  
  // 默认返回黑色
  return { r: 0, g: 0, b: 0 };
}

/**
 * 生成颜色的浅色变体
 * @param color 颜色对象或字符串
 * @param amount 变亮程度（0-1）
 * @returns 变亮后的颜色对象
 * @example
 * lighten({ r: 100, g: 100, b: 100 }, 0.2); // { r: 151, g: 151, b: 151 }
 * lighten('#ff0000', 0.2); // { r: 255, g: 51, b: 51 }
 */
export function lighten(color: Color | string, amount: number): Color {
  const colorObj = typeof color === 'string' ? parseColor(color) : color;
  const { r, g, b, a } = colorObj;
  
  return {
    r: Math.min(255, r + Math.round((255 - r) * amount)),
    g: Math.min(255, g + Math.round((255 - g) * amount)),
    b: Math.min(255, b + Math.round((255 - b) * amount)),
    a
  };
}

/**
 * 生成颜色的深色变体
 * @param color 颜色对象或字符串
 * @param amount 变暗程度（0-1）
 * @returns 变暗后的颜色对象
 * @example
 * darken({ r: 100, g: 100, b: 100 }, 0.2); // { r: 80, g: 80, b: 80 }
 * darken('#ff0000', 0.2); // { r: 204, g: 0, b: 0 }
 */
export function darken(color: Color | string, amount: number): Color {
  const colorObj = typeof color === 'string' ? parseColor(color) : color;
  const { r, g, b, a } = colorObj;
  
  return {
    r: Math.max(0, r - Math.round(r * amount)),
    g: Math.max(0, g - Math.round(g * amount)),
    b: Math.max(0, b - Math.round(b * amount)),
    a
  };
}

/**
 * 生成颜色的透明变体
 * @param color 颜色对象或字符串
 * @param amount 透明度（0-1）
 * @returns 半透明颜色对象
 * @example
 * transparent({ r: 255, g: 0, b: 0 }, 0.5); // { r: 255, g: 0, b: 0, a: 0.5 }
 * transparent('#ff0000', 0.5); // { r: 255, g: 0, b: 0, a: 0.5 }
 */
export function transparent(color: Color | string, amount: number): Color {
  const colorObj = typeof color === 'string' ? parseColor(color) : color;
  const { r, g, b } = colorObj;
  
  return {
    r,
    g,
    b,
    a: amount
  };
}

/**
 * 生成调色板颜色变体
 * @param baseColor 基础颜色
 * @param options 选项
 * @returns 调色板颜色对象
 * @example
 * generatePalette('#3f51b5', { steps: 5 });
 * // 返回包含5个深色和5个浅色变体的调色板
 */
export function generatePalette(
  baseColor: Color | string,
  options: { steps?: number; darkSteps?: number; lightSteps?: number; stepSize?: number } = {}
) {
  const colorObj = typeof baseColor === 'string' ? parseColor(baseColor) : baseColor;
  const { steps = 5, darkSteps = steps, lightSteps = steps, stepSize = 0.1 } = options;
  
  const palette: Record<string, Color> = {
    base: colorObj
  };
  
  // 生成深色变体
  for (let i = 1; i <= darkSteps; i++) {
    palette[`dark-${i}`] = darken(colorObj, stepSize * i);
  }
  
  // 生成浅色变体
  for (let i = 1; i <= lightSteps; i++) {
    palette[`light-${i}`] = lighten(colorObj, stepSize * i);
  }
  
  return palette;
}

/**
 * 响应式断点类型
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 响应式断点定义
 */
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/**
 * 检测当前视口是否匹配断点
 * @param breakpoint 断点名称
 * @returns 是否匹配
 * @example
 * if (matchBreakpoint('md')) {
 *   // 当前视口宽度 >= 768px
 * }
 */
export function matchBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  const width = window.innerWidth;
  return width >= breakpoints[breakpoint];
}

/**
 * 获取当前视口的断点
 * @returns 当前断点名称
 * @example
 * const currentBreakpoint = getCurrentBreakpoint(); // 例如: 'md'
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') {
    return 'md';
  }
  
  const width = window.innerWidth;
  const breakpointEntries = Object.entries(breakpoints) as Array<[Breakpoint, number]>;
  
  // 按宽度从大到小排序断点
  const sortedBreakpoints = breakpointEntries.sort((a, b) => b[1] - a[1]);
  
  // 找到第一个小于等于当前宽度的断点
  const matchedBreakpoint = sortedBreakpoints.find(([, size]) => width >= size);
  
  return matchedBreakpoint ? matchedBreakpoint[0] : 'xs';
}

/**
 * 创建媒体查询条件
 * @param breakpoint 断点名称
 * @param type 查询类型
 * @returns 媒体查询条件字符串
 * @example
 * const mobileQuery = createMediaQuery('sm', 'max');
 * // '@media (max-width: 575.98px)'
 */
export function createMediaQuery(
  breakpoint: Breakpoint,
  type: 'min' | 'max' = 'min'
): string {
  const value = breakpoints[breakpoint];
  
  if (type === 'max') {
    return `@media (max-width: ${value - 0.02}px)`;
  }
  
  return `@media (min-width: ${value}px)`;
}

/**
 * 过渡效果类型
 */
export type Easing = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'cubic-bezier';

/**
 * 常用过渡效果定义
 */
export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

/**
 * 创建CSS过渡属性
 * @param properties 要过渡的CSS属性
 * @param options 过渡选项
 * @returns CSS过渡属性值
 * @example
 * createTransition(['opacity', 'transform'], { duration: 300, easing: 'ease-out' });
 * // 'opacity 300ms ease-out, transform 300ms ease-out'
 */
export function createTransition(
  properties: string | string[],
  options: { duration?: number; easing?: Easing | string; delay?: number } = {}
): string {
  const { duration = 300, easing = 'ease', delay = 0 } = options;
  const props = Array.isArray(properties) ? properties : [properties];
  
  return props.map(prop => 
    `${prop} ${duration}ms ${easing}${delay ? ` ${delay}ms` : ''}`
  ).join(', ');
}

/**
 * 主题类型
 */
export type Theme = {
  colors: Record<string, string>;
  spacing: Record<string, string | number>;
  typography: Record<string, string | number>;
  [key: string]: any;
};

/**
 * 创建主题
 * @param baseTheme 基础主题
 * @param overrides 覆盖设置
 * @returns 合并后的主题
 * @example
 * const theme = createTheme({
 *   colors: { primary: '#3f51b5' }
 * }, {
 *   colors: { secondary: '#f50057' }
 * });
 * // { colors: { primary: '#3f51b5', secondary: '#f50057' } }
 */
export function createTheme(baseTheme: Partial<Theme>, overrides: Partial<Theme> = {}): Theme {
  // 默认主题
  const defaultTheme: Theme = {
    colors: {
      primary: '#3f51b5',
      secondary: '#f50057',
      success: '#4caf50',
      error: '#f44336',
      warning: '#ff9800',
      info: '#2196f3',
      background: '#ffffff',
      text: '#000000'
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48
    },
    typography: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      fontSize: 16,
      lineHeight: 1.5
    }
  };
  
  // 深度合并
  const mergedTheme = deepMerge(defaultTheme, baseTheme);
  return deepMerge(mergedTheme, overrides);
}

/**
 * 深度合并对象
 * @param target 目标对象
 * @param source 源对象
 * @returns 合并后的对象
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const output = { ...target } as T;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key as keyof T] = deepMerge(target[key as keyof T], source[key]) as any;
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * 检查值是否为对象
 * @param item 要检查的值
 * @returns 是否为对象
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 可访问性工具对象
 */
export const a11y = {
  /**
   * 计算颜色对比度
   * @param foreground 前景色
   * @param background 背景色
   * @returns 对比度比值
   * @example
   * a11y.contrast('#000000', '#ffffff'); // 21
   */
  contrast(foreground: Color | string, background: Color | string): number {
    const fgColor = typeof foreground === 'string' ? parseColor(foreground) : foreground;
    const bgColor = typeof background === 'string' ? parseColor(background) : background;
    
    // 计算亮度
    const getLuminance = (color: Color): number => {
      const { r, g, b } = color;
      const [rs, gs, bs] = [r, g, b].map(c => {
        const val = c / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const fgLuminance = getLuminance(fgColor);
    const bgLuminance = getLuminance(bgColor);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    return (lighter + 0.05) / (darker + 0.05);
  },
  
  /**
   * 检查对比度是否符合WCAG 2.0标准
   * @param foreground 前景色
   * @param background 背景色
   * @param level 标准级别
   * @returns 是否通过
   * @example
   * a11y.isContrastValid('#000000', '#ffffff', 'AA'); // true
   */
  isContrastValid(
    foreground: Color | string,
    background: Color | string,
    level: 'AA' | 'AAA' = 'AA'
  ): boolean {
    const ratio = this.contrast(foreground, background);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
  
  /**
   * 获取符合对比度要求的文本颜色
   * @param background 背景色
   * @param darkColor 深色选项
   * @param lightColor 浅色选项
   * @param level 标准级别
   * @returns 适合的文本颜色
   * @example
   * a11y.getTextColor('#f0f0f0'); // '#000000'
   * a11y.getTextColor('#333333'); // '#ffffff'
   */
  getTextColor(
    background: Color | string,
    darkColor: Color | string = '#000000',
    lightColor: Color | string = '#ffffff',
    level: 'AA' | 'AAA' = 'AA'
  ): string {
    const bgColor = typeof background === 'string' ? parseColor(background) : background;
    const darkContrast = this.contrast(darkColor, bgColor);
    const lightContrast = this.contrast(lightColor, bgColor);
    
    const threshold = level === 'AA' ? 4.5 : 7;
    
    if (darkContrast >= threshold && lightContrast >= threshold) {
      // 如果两种颜色都满足要求，选择对比度更高的
      return darkContrast > lightContrast
        ? (typeof darkColor === 'string' ? darkColor : rgbToHex(darkColor))
        : (typeof lightColor === 'string' ? lightColor : rgbToHex(lightColor));
    }
    
    // 返回满足要求的颜色
    if (darkContrast >= threshold) {
      return typeof darkColor === 'string' ? darkColor : rgbToHex(darkColor);
    }
    
    if (lightContrast >= threshold) {
      return typeof lightColor === 'string' ? lightColor : rgbToHex(lightColor);
    }
    
    // 如果都不满足，返回对比度更高的
    return darkContrast > lightContrast
      ? (typeof darkColor === 'string' ? darkColor : rgbToHex(darkColor))
      : (typeof lightColor === 'string' ? lightColor : rgbToHex(lightColor));
  }
}; 