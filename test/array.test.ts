import { unique, flatten, chunk, shuffle, groupBy } from '../src/array';

describe('array module', () => {
  describe('unique function', () => {
    test('应该去除数组中的重复元素', () => {
      expect(unique([1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
    });

    test('应该处理空数组', () => {
      expect(unique([])).toEqual([]);
    });

    test('应该处理对象数组', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const arr = [obj1, obj2, obj1];
      const result = unique(arr);
      expect(result).toHaveLength(2);
      expect(result[0]).toBe(obj1);
      expect(result[1]).toBe(obj2);
    });
  });

  describe('flatten function', () => {
    test('应该扁平化嵌套数组', () => {
      expect(flatten([1, [2, [3, 4]]])).toEqual([1, 2, 3, 4]);
    });

    test('应该根据指定深度扁平化数组', () => {
      expect(flatten([1, [2, [3, 4]]], 1)).toEqual([1, 2, [3, 4]]);
    });

    test('应该处理空数组', () => {
      expect(flatten([])).toEqual([]);
    });
  });

  describe('chunk function', () => {
    test('应该将数组分块', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    test('块大小大于数组长度时应返回单个块', () => {
      expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
    });

    test('块大小为0或负数时应返回空数组', () => {
      expect(chunk([1, 2, 3], 0)).toEqual([]);
      expect(chunk([1, 2, 3], -1)).toEqual([]);
    });

    test('应该处理空数组', () => {
      expect(chunk([], 2)).toEqual([]);
    });
  });

  describe('shuffle function', () => {
    test('应该随机排序数组', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled = shuffle([...arr]);
      
      // 长度应该相同
      expect(shuffled).toHaveLength(arr.length);
      
      // 元素应该相同，但顺序可能不同
      expect(shuffled.sort()).toEqual(arr.sort());
      
      // 注意：理论上有极小概率随机后顺序不变，但实际上几乎不可能
      // 这个测试可能偶尔失败，但概率极低
      const multipleShuffles = Array.from({ length: 10 }, () => shuffle([...arr]));
      expect(multipleShuffles.some(s => !arraysEqual(s, arr))).toBe(true);
    });

    test('应该处理空数组', () => {
      expect(shuffle([])).toEqual([]);
    });

    test('应该处理单元素数组', () => {
      expect(shuffle([1])).toEqual([1]);
    });
  });

  describe('groupBy function', () => {
    test('应该按照键函数对数组进行分组', () => {
      const arr = [1, 2, 3, 4, 5];
      const grouped = groupBy(arr, n => n % 2 === 0 ? 'even' : 'odd');
      expect(grouped).toEqual({
        even: [2, 4],
        odd: [1, 3, 5]
      });
    });

    test('应该处理对象数组', () => {
      const arr = [
        { id: 1, category: 'A' },
        { id: 2, category: 'B' },
        { id: 3, category: 'A' }
      ];
      const grouped = groupBy(arr, item => item.category);
      expect(grouped).toEqual({
        A: [{ id: 1, category: 'A' }, { id: 3, category: 'A' }],
        B: [{ id: 2, category: 'B' }]
      });
    });

    test('应该处理空数组', () => {
      expect(groupBy([], x => x)).toEqual({});
    });
  });
});

// 辅助函数：比较两个数组是否相等
function arraysEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}