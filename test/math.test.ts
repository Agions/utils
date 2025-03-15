import { round, floor, ceil, random, clamp, median } from '../src/math';

describe('math module', () => {
  describe('round function', () => {
    test('应该正确四舍五入', () => {
      expect(round(1.2345)).toBe(1);
      expect(round(1.5)).toBe(2);
    });

    test('应该根据精度四舍五入', () => {
      expect(round(1.2345, 2)).toBe(1.23);
      expect(round(1.2345, 3)).toBe(1.235);
    });
  });

  describe('floor function', () => {
    test('应该正确向下取整', () => {
      expect(floor(1.9)).toBe(1);
      expect(floor(1.1)).toBe(1);
    });

    test('应该根据精度向下取整', () => {
      expect(floor(1.2345, 2)).toBe(1.23);
      expect(floor(1.2345, 3)).toBe(1.234);
    });
  });

  describe('ceil function', () => {
    test('应该正确向上取整', () => {
      expect(ceil(1.1)).toBe(2);
      expect(ceil(1.9)).toBe(2);
    });

    test('应该根据精度向上取整', () => {
      expect(ceil(1.2345, 2)).toBe(1.24);
      expect(ceil(1.2345, 3)).toBe(1.235);
    });
  });

  describe('random function', () => {
    test('应该生成指定范围内的随机数', () => {
      const result = random(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(10);
    });

    test('应该生成整数随机数', () => {
      const result = random(1, 10, true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThan(10);
      expect(Number.isInteger(result)).toBe(true);
    });

    test('应该使用默认范围', () => {
      const result = random();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });
  });

  describe('clamp function', () => {
    test('应该限制数值不超过最大值', () => {
      expect(clamp(15, 1, 10)).toBe(10);
    });

    test('应该限制数值不小于最小值', () => {
      expect(clamp(-5, 1, 10)).toBe(1);
    });

    test('应该不改变范围内的数值', () => {
      expect(clamp(5, 1, 10)).toBe(5);
    });
  });

  describe('median function', () => {
    test('应该计算奇数长度数组的中位数', () => {
      expect(median([1, 3, 5, 7, 9])).toBe(5);
    });

    test('应该计算偶数长度数组的中位数', () => {
      expect(median([1, 3, 5, 7])).toBe(4);
    });

    test('应该处理空数组', () => {
      expect(median([])).toBe(0);
    });

    test('应该处理无序数组', () => {
      expect(median([9, 1, 7, 3, 5])).toBe(5);
    });
  });
});