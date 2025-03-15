import { formatDate, isLeapYear, getDaysInMonth, addDays, diffDays, formatTimeAgo } from '../src/date';

describe('date utilities', () => {
  describe('formatTimeAgo', () => {
    const now = new Date('2024-03-15T12:00:00');

    test('返回秒级差异', () => {
      const date = new Date('2024-03-15T11:59:57');
      expect(formatTimeAgo(date, now)).toBe('3秒前');
    });

    test('返回分钟级差异', () => {
      const date = new Date('2024-03-15T11:55:00');
      expect(formatTimeAgo(date, now)).toBe('5分钟前');
    });

    test('返回小时级差异', () => {
      const date = new Date('2024-03-15T10:00:00');
      expect(formatTimeAgo(date, now)).toBe('2小时前');
    });

    test('返回天级差异', () => {
      const date = new Date('2024-03-13T12:00:00');
      expect(formatTimeAgo(date, now)).toBe('2天前');
    });

    test('超过3天显示具体日期', () => {
      const date = new Date('2024-03-11T12:00:00');
      expect(formatTimeAgo(date, now)).toBe('3月11日');
    });

    test('跨年显示完整日期', () => {
      const date = new Date('2023-03-11T12:00:00');
      expect(formatTimeAgo(date, now)).toBe('2023年3月11日');
    });
  });
  describe('formatDate function', () => {
    test('应该正确格式化日期', () => {
      const date = new Date(2023, 3, 15, 14, 30, 45); // 2023-04-15 14:30:45
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-04-15');
      expect(formatDate(date, 'YYYY/MM/DD HH:mm:ss')).toBe('2023/04/15 14:30:45');
      expect(formatDate(date)).toBe('2023-04-15'); // 默认格式
    });

    test('应该处理单位数的月日时分秒', () => {
      const date = new Date(2023, 0, 5, 9, 5, 7); // 2023-01-05 09:05:07
      expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2023-01-05 09:05:07');
    });
  });

  describe('isLeapYear function', () => {
    test('应该正确判断闰年', () => {
      expect(isLeapYear(2020)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2024)).toBe(true);
    });

    test('应该正确判断非闰年', () => {
      expect(isLeapYear(2021)).toBe(false);
      expect(isLeapYear(2022)).toBe(false);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(1900)).toBe(false); // 能被100整除但不能被400整除
    });
  });

  describe('getDaysInMonth function', () => {
    test('应该返回正确的月份天数', () => {
      expect(getDaysInMonth(2023, 1)).toBe(31); // 一月
      expect(getDaysInMonth(2023, 2)).toBe(28); // 二月非闰年
      expect(getDaysInMonth(2020, 2)).toBe(29); // 二月闰年
      expect(getDaysInMonth(2023, 4)).toBe(30); // 四月
    });

    test('应该处理无效输入', () => {
      expect(getDaysInMonth(2023, 0)).toBe(0); // 无效月份
      expect(getDaysInMonth(2023, 13)).toBe(0); // 无效月份
    });
  });

  describe('addDays function', () => {
    test('应该正确添加天数', () => {
      const date = new Date(2023, 3, 15); // 2023-04-15
      const result = addDays(date, 5);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(3); // 0-indexed, so 3 is April
      expect(result.getDate()).toBe(20);
    });

    test('应该处理跨月添加', () => {
      const date = new Date(2023, 3, 28); // 2023-04-28
      const result = addDays(date, 5);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(4); // 0-indexed, so 4 is May
      expect(result.getDate()).toBe(3);
    });

    test('应该处理跨年添加', () => {
      const date = new Date(2023, 11, 30); // 2023-12-30
      const result = addDays(date, 5);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // 0-indexed, so 0 is January
      expect(result.getDate()).toBe(4);
    });

    test('应该处理负数天数', () => {
      const date = new Date(2023, 3, 15); // 2023-04-15
      const result = addDays(date, -5);
      expect(result.getFullYear()).toBe(2023);
      expect(result.getMonth()).toBe(3);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('diffDays function', () => {
    test('应该计算正确的天数差', () => {
      const date1 = new Date(2023, 3, 15); // 2023-04-15
      const date2 = new Date(2023, 3, 20); // 2023-04-20
      expect(diffDays(date1, date2)).toBe(5);
    });

    test('应该处理日期顺序', () => {
      const date1 = new Date(2023, 3, 20); // 2023-04-20
      const date2 = new Date(2023, 3, 15); // 2023-04-15
      expect(diffDays(date1, date2)).toBe(-5);
    });

    test('应该处理跨月日期', () => {
      const date1 = new Date(2023, 3, 28); // 2023-04-28
      const date2 = new Date(2023, 4, 3); // 2023-05-03
      expect(diffDays(date1, date2)).toBe(5);
    });

    test('应该处理跨年日期', () => {
      const date1 = new Date(2023, 11, 30); // 2023-12-30
      const date2 = new Date(2024, 0, 4); // 2024-01-04
      expect(diffDays(date1, date2)).toBe(5);
    });
  });
});